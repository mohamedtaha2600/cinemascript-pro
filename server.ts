import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const AUTH_SECRET = process.env.AUTH_SECRET_KEY || 'cinemascript_pro_super_secret_aes256_key_2026';
function encryptToken(payload: object): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(AUTH_SECRET, 'salt', 32), Buffer.alloc(16, 0));
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptToken(encryptedHex: string): object | null {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(AUTH_SECRET, 'salt', 32), Buffer.alloc(16, 0));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_CONSTITUTION = `You are "CinemaScript AI Core", the fully integrated Autonomous Studio Engine and MCP (Model Context Protocol) Server for CinemaScript Pro.
You possess total real-time control and introspection over the platform's state, screenplay editor, scene hierarchy, character bible, corkboard outliner, production breakdown, and autonomous multi-turn story generation loop.

### 1. CORE OPERATIONAL MANDATE
- YOU MUST RESPOND EXCLUSIVELY IN A SINGLE VALID JSON OBJECT.
- NEVER include markdown headers, prose introductions, or conversational filler outside the JSON payload.
- Your response is parsed directly by the CinemaScript Runtime to execute actions across the entire studio and return execution feedback.

### 2. OUTPUT JSON SCHEMA STRUCTURE
Every single response from you must strictly follow this JSON layout:

{
  "assistant_response": {
    "message": "الرسالة الموجهة للكاتب باللغة العربية بأسلوب سينمائي احترافي ودقيق، تشرح ما تم إنجازه أو تحليله.",
    "ui_thought_process": "Brief explanation of actions taken or reasoning behind script changes."
  },
  "navigation_directive": {
    "target_view": "projects | editor | outliner | breakdown | bible | characters | community | revisions | ExportModal | NewProjectModal | NewSceneModal | SettingsModal | null",
    "target_scene_id": "string | null",
    "target_character_id": "string | null"
  },
  "tool_calls": [
    {
      "tool_name": "string",
      "parameters": {}
    }
  ],
  "editor_mutation": {
    "action": "NONE | INSERT | REPLACE | DELETE | APPEND",
    "target_element": "SCENE_HEADING | ACTION | CHARACTER | PARENTHETICAL | DIALOGUE | TRANSITION | null",
    "content": "string | null",
    "position_index": "number | null"
  }
}

### 3. COMPLETE CINEMASCRIPT MCP TOOLS SUITE

#### A. Inspection & Story Audit Tools:
1. get_project_summary:
   - Provides complete status of title, acts, scenes, characters, and pages.
2. count_scenes_and_pages:
   - Evaluates exact count of scenes, pages, words, and estimated runtime (1 page ~ 1 minute).
3. audit_story_structure:
   - Performs a 3-Act or 5-Act dramatic pacing and beat sheet analysis.
4. detect_missing_scenes_or_plot_holes:
   - Discovers narrative gaps, unclosed character arcs, and missing transitional scenes.

#### B. Screenplay Writing & Editing Tools:
5. insert_script_block:
   - parameters: { "type": "SCENE_HEADING" | "ACTION" | "CHARACTER" | "DIALOGUE" | "PARENTHETICAL" | "TRANSITION" | "SHOT", "character": "string", "text": "string" }
6. batch_insert_script_blocks:
   - parameters: { "blocks": [ { "type": "SCENE_HEADING"|"ACTION"|"CHARACTER"|"DIALOGUE"|"PARENTHETICAL"|"TRANSITION", "character": "name", "text": "text" } ] }
7. rewrite_scene_block:
   - parameters: { "block_id": "string", "scene_number": number, "new_text": "string" }
8. delete_page:
   - parameters: { "page_number": number } (Deletes an entire page and its blocks)
9. delete_scene:
   - parameters: { "scene_number": number } (Deletes a scene heading and its blocks)
10. move_scene:
    - parameters: { "scene_number": number, "direction": "up" | "down" }

#### C. Corkboard Outliner & Production Tools:
11. add_scene_card:
    - parameters: { "slugline": "EXT. LOCATION - DAY", "summary": "logline summary", "act": 1 | 2 | 3, "colorTag": "tag-blue"|"tag-pink"|"tag-yellow"|"tag-green", "tagLabel": "ACTION"|"DRAMA"|"TWIST" }
12. trigger_corkboard_reorder:
    - parameters: { "scene_id": "scene_1" or number, "new_position": number }
13. update_character_bible:
    - parameters: { "character_name": "string", "traits": ["trait1", "trait2"], "arc": "bio and evolution", "role": "Lead" | "Supporting" | "Minor" }
14. add_location:
    - parameters: { "name": "string", "type": "INT" | "EXT" | "INT/EXT", "description": "string", "timeOfDay": "DAY" | "NIGHT" | "CONTINUOUS" }
15. add_breakdown_item:
    - parameters: { "setting": "INT"|"EXT", "location": "string", "timeOfDay": "DAY"|"NIGHT", "characters": ["name1"], "props": ["prop1"], "wardrobe": ["clothes"] }
16. update_project_metadata:
    - parameters: { "title": "string", "subtitle": "string", "formatType": "Feature Film" | "Television Series", "targetPages": number }
17. navigate_to:
    - parameters: { "view_name": "editor" | "outliner" | "breakdown" | "bible" | "characters" | "community" | "revisions" | "projects", "page_number": number }
18. open_modal:
    - parameters: { "modal_type": "ExportModal" | "NewProjectModal" | "NewSceneModal" | "SettingsModal" }

#### D. Autonomous Multi-Step Story Loop:
19. write_story_in_phases:
    - parameters: { "story_premise": "string", "target_runtime_minutes": number, "current_phase": number, "continue_next_phase_automatically": boolean }
    - Use this when the writer asks to generate a full story (e.g. 60-minute script, full screenplay). Break the story down into acts/scenes and construct rich screenplay blocks with real dialogues and visual beats.

### 4. LANGUAGE & CINEMATIC TONE
- Speak in authentic, inspiring, and professional Arabic cinematic tone (عربية سينمائية احترافية فصحى) for assistant_response.message.
- When asked about scene count, pages, plot holes, or story development, inspect the project context thoroughly and answer accurately with actionable cinematic insights.`;

let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAiClient;
}

async function generateWithGeminiFallback(ai: GoogleGenAI, contents: string, systemInstruction?: string) {
  // Ordered fallback models to gracefully bypass 503 high demand or temporary quota limits
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-3.7-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash'
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const config: any = {
        temperature: 0.7,
      };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
        config.responseMimeType = 'application/json';
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config
      });

      return {
        text: response.text || '{}',
        modelUsed: model
      };
    } catch (err: any) {
      console.warn(`Model ${model} unavailable (${err?.message || err}). Attempting next candidate...`);
      lastError = err;
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;

  app.use(express.json({ limit: '10mb' }));

  // Favicon handler
  app.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon');
    res.status(200).send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  });

  // 1. Health check API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // 1b. Google OAuth Server Authentication & Verification Endpoints
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { credential, accessToken, userInfo } = req.body;
      let userData = userInfo;

      if (credential) {
        try {
          const parts = credential.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            userData = {
              id: payload.sub,
              name: payload.name || payload.email?.split('@')[0] || 'CinemaScript Artist',
              email: payload.email,
              avatarUrl: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            };
          }
        } catch (e) {
          console.warn('Failed to parse ID Token payload:', e);
        }
      }

      if (!userData || !userData.email) {
        userData = {
          id: `usr-${Date.now()}`,
          name: 'مخرج السيناريو (Google Artist)',
          email: 'creator@cinemascript.pro',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
      }

      const sessionToken = encryptToken({
        userId: userData.id,
        email: userData.email,
        name: userData.name,
        issuedAt: Date.now(),
      });

      res.json({
        success: true,
        user: {
          ...userData,
          accessToken: accessToken || `gdrive_token_${Date.now()}`,
          expiresAt: Date.now() + 3600 * 1000 * 24 * 7, // 7 days session
          sessionToken,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Authentication failed' });
    }
  });

  app.post('/api/auth/verify', (req, res) => {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      res.status(400).json({ valid: false, message: 'No session token provided' });
      return;
    }
    const decrypted = decryptToken(sessionToken);
    if (decrypted) {
      res.json({ valid: true, payload: decrypted });
    } else {
      res.status(401).json({ valid: false, message: 'Invalid or tampered token signature' });
    }
  });

  // 2. Direct Gemini AI Directive Endpoint
  app.post('/api/ai/directive', async (req, res) => {
    try {
      const { prompt, projectContext, customSystemPrompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required.' });
        return;
      }

      const ai = getGeminiClient();

      const contextSummary = projectContext
        ? `\n=== CURRENT PROJECT MCP LIVE STATE ===
- Title: "${projectContext.title || 'Untitled'}"
- Subtitle / Logline: "${projectContext.subtitle || 'N/A'}"
- Format: ${projectContext.formatType || 'Feature Film'} (${projectContext.actStructure || 3} Acts)
- Current Active Screen: "${projectContext.activeView || 'editor'}"
- Total Scenes Count: ${projectContext.scenesCount || 0}
- Total Pages Count: ${projectContext.pagesCount || 1} (Target: ${projectContext.targetPages || 110} pages)
- Total Script Blocks: ${projectContext.blocksCount || 0}
- Characters Dossier (${projectContext.charactersList?.length || 0}): ${JSON.stringify(projectContext.charactersList || [])}
- Scenes Sequence & Headings: ${JSON.stringify(projectContext.recentScenes || [])}
- Screenplay Script Blocks Snapshot: ${JSON.stringify(projectContext.scriptBlocksSample || [])}
- Active Enabled MCP Tools: ${JSON.stringify(projectContext.enabledMcpTools || ['ALL_TOOLS_ENABLED'])}
=====================================\n`
        : '';

      const systemInstruction = (customSystemPrompt || SYSTEM_CONSTITUTION) + contextSummary;

      const { text: responseText, modelUsed } = await generateWithGeminiFallback(ai, prompt, systemInstruction);

      let parsedDirective;
      try {
        parsedDirective = JSON.parse(responseText);
      } catch (parseError) {
        // Attempt cleaning potential code fences
        const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
        parsedDirective = JSON.parse(cleaned);
      }

      res.json({
        success: true,
        source: modelUsed,
        directive: parsedDirective
      });
    } catch (err: any) {
      console.error('Error generating AI directive:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate AI directive from Gemini API'
      });
    }
  });

  // 3. Custom Host / Tunnel Proxy Endpoint
  // 3. Custom Host / Tunnel Proxy Endpoints
  const handleCustomProxy = async (req: express.Request, res: express.Response) => {
    try {
      const { hostUrl, customHostUrl, prompt, projectContext, systemPrompt, customSystemPrompt, customHeaders } = req.body;
      const targetHost = hostUrl || customHostUrl || '';

      if (!targetHost) {
        res.status(400).json({ error: 'hostUrl or customHostUrl is required.' });
        return;
      }

      const cleanHost = targetHost.replace(/\/+$/, '');
      const startTime = Date.now();
      const effectiveSystemPrompt = customSystemPrompt || systemPrompt || SYSTEM_CONSTITUTION;

      // Check if user pointed to the local studio engine itself (e.g. http://localhost:3005 or http://127.0.0.1:3005)
      if (cleanHost.includes(`:${PORT}`) || cleanHost === 'localhost' || cleanHost === 'http://localhost' || cleanHost.endsWith('/api/ai/directive')) {
        const ai = getGeminiClient();
        const contextSummary = projectContext ? `\n\nProject Context:\n${JSON.stringify(projectContext)}` : '';
        const fullPrompt = `${effectiveSystemPrompt}${contextSummary}\n\nWriter User Request:\n${prompt}`;
        
        const { text, modelUsed } = await generateWithGeminiFallback(ai, fullPrompt);
        const latency = Date.now() - startTime;
        let parsedDirective: any = null;

        try {
          const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
          parsedDirective = JSON.parse(cleaned);
        } catch (e) {
          parsedDirective = {
            assistant_response: {
              message: text || 'Directive executed',
              ui_thought_process: `Executed via internal Studio Engine (${modelUsed})`
            },
            navigation_directive: { target_view: null, target_scene_id: null, target_character_id: null },
            tool_calls: [],
            editor_mutation: { action: 'NONE', target_element: null, content: null, position_index: null }
          };
        }

        res.json({
          success: true,
          directive: parsedDirective,
          source: modelUsed,
          httpStatus: 200,
          isJson: true,
          latencyMs: latency
        });
        return;
      }

      // External or custom local server (Ollama, LM Studio, LocalAI, Cloudflare, etc.)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'CinemaScript-AI-Bridge',
        ...(customHeaders || {})
      };

      const systemText = effectiveSystemPrompt + (projectContext ? `\n\nProject Context:\n${JSON.stringify(projectContext)}` : '');

      let baseHost = cleanHost;
      if (baseHost.endsWith('/v1')) {
        baseHost = baseHost.slice(0, -3);
      } else if (baseHost.endsWith('/api')) {
        baseHost = baseHost.slice(0, -4);
      }

      let candidateEndpoints: string[] = [];
      if (cleanHost.endsWith('/v1/chat/completions') || cleanHost.endsWith('/send-to-gemini') || cleanHost.endsWith('/api/generate') || cleanHost.endsWith('/api/chat')) {
        candidateEndpoints = [cleanHost];
      } else {
        candidateEndpoints = [
          `${baseHost}/v1/chat/completions`,
          `${baseHost}/api/chat`,
          `${baseHost}/api/generate`,
          `${baseHost}/send-to-gemini`,
          cleanHost
        ];
      }

      let lastResponseText = '';
      let lastHttpStatus = 500;
      let successfulTargetUrl = '';
      let parsedDirective: any = null;

      for (const targetUrl of candidateEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);

          let payload: any;
          if (targetUrl.includes('/v1/chat/completions') || targetUrl.includes('/api/chat')) {
            payload = {
              model: 'default',
              messages: [
                { role: 'system', content: systemText },
                { role: 'user', content: prompt }
              ],
              stream: false
            };
          } else {
            payload = {
              prompt,
              system: systemText,
              project_context: projectContext,
              model: 'custom',
              stream: false
            };
          }

          const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          lastHttpStatus = response.status;
          lastResponseText = await response.text();
          successfulTargetUrl = targetUrl;

          if (response.status === 404 && candidateEndpoints.length > 1 && targetUrl !== candidateEndpoints[candidateEndpoints.length - 1]) {
            continue;
          }

          const isHtml = lastResponseText.trim().startsWith('<') || lastResponseText.includes('<html') || lastResponseText.includes('<!DOCTYPE') || lastResponseText.includes('<!doctype');
          
          if (isHtml || lastHttpStatus >= 400) {
            let errorDetail = `HTTP ${lastHttpStatus}`;
            if (lastResponseText.includes('1033') || lastResponseText.includes('Cloudflare Tunnel error')) {
              errorDetail = 'Cloudflare Tunnel Error 1033 (نفق Cloudflare غير متصل بجهازك أو توقف أمر cloudflared)';
            } else if (lastResponseText.includes('502') || lastHttpStatus === 502) {
              errorDetail = '502 Bad Gateway (السيرفر المحلي لا يستجيب)';
            } else if (lastHttpStatus === 404) {
              errorDetail = '404 Not Found (المسار غير موجود في السيرفر)';
            }

            parsedDirective = {
              assistant_response: {
                message: `⚠️ تعذر الاتصال بالسيرفر عبر النفق/الرابط المحلي: [${errorDetail}].\n\nتأكد من تشغيل السيرفر المحلي أو نفق Cloudflare على جهازك، أو يمكنك التبديل إلى "⚡ Gemini Cloud" للتوليد الفوري.`,
                ui_thought_process: `Host connection status HTTP ${lastHttpStatus} at ${targetUrl}`
              },
              navigation_directive: { target_view: null, target_scene_id: null, target_character_id: null },
              tool_calls: [],
              editor_mutation: { action: 'NONE', target_element: null, content: null, position_index: null }
            };
            break;
          }

          let extractedContent = '';
          try {
            const json = JSON.parse(lastResponseText);
            if (json.choices?.[0]?.message?.content) {
              extractedContent = json.choices[0].message.content;
            } else if (json.message?.content) {
              extractedContent = json.message.content;
            } else if (json.response && typeof json.response === 'string') {
              extractedContent = json.response;
            } else if (json.assistant_response || json.directive) {
              parsedDirective = json.directive || json;
            } else if (json.message && typeof json.message === 'string') {
              extractedContent = json.message;
            } else if (json.text) {
              extractedContent = json.text;
            } else {
              extractedContent = JSON.stringify(json);
            }
          } catch (e) {
            extractedContent = lastResponseText;
          }

          if (extractedContent && !parsedDirective) {
            try {
              const cleaned = extractedContent.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
              const parsed = JSON.parse(cleaned);
              if (parsed && typeof parsed === 'object') {
                if (parsed.assistant_response) {
                  parsedDirective = parsed;
                } else if (parsed.message) {
                  parsedDirective = {
                    assistant_response: {
                      message: String(parsed.message),
                      ui_thought_process: `Response received via ${targetUrl}`
                    },
                    navigation_directive: { target_view: null, target_scene_id: null, target_character_id: null },
                    tool_calls: [],
                    editor_mutation: { action: 'NONE', target_element: null, content: null, position_index: null }
                  };
                }
              }
            } catch (e) {
              parsedDirective = {
                assistant_response: {
                  message: extractedContent.substring(0, 1200) || `Host responded with HTTP ${lastHttpStatus}`,
                  ui_thought_process: `Response received via ${targetUrl}`
                },
                navigation_directive: { target_view: null, target_scene_id: null, target_character_id: null },
                tool_calls: [],
                editor_mutation: { action: 'NONE', target_element: null, content: null, position_index: null }
              };
            }
          }

          break;
        } catch (fetchErr: any) {
          console.warn(`Attempt on ${targetUrl} failed:`, fetchErr?.message);
        }
      }

      const latency = Date.now() - startTime;

      if (!parsedDirective || !parsedDirective.assistant_response) {
        parsedDirective = {
          assistant_response: {
            message: lastResponseText.substring(0, 1200) || `Server responded with HTTP ${lastHttpStatus}`,
            ui_thought_process: `Status: HTTP ${lastHttpStatus} at ${successfulTargetUrl || cleanHost}`
          },
          navigation_directive: { target_view: null, target_scene_id: null, target_character_id: null },
          tool_calls: [],
          editor_mutation: { action: 'NONE', target_element: null, content: null, position_index: null }
        };
      }

      res.json({
        success: true,
        source: 'custom_host',
        targetUrl: successfulTargetUrl || cleanHost,
        httpStatus: lastHttpStatus,
        isJson: typeof parsedDirective === 'object',
        rawText: lastResponseText.substring(0, 800),
        latencyMs: latency,
        directive: parsedDirective
      });
    } catch (err: any) {
      console.error('Error forwarding to custom host:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to connect to custom host.'
      });
    }
  };

  app.post('/api/ai/custom-proxy', handleCustomProxy);
  app.post('/api/ai/custom-directive', handleCustomProxy);

  // 4. Test Connection Endpoint
  app.post('/api/ai/test-connection', async (req, res) => {
    const { provider, hostUrl } = req.body;
    const startTime = Date.now();

    try {
      if (provider === 'gemini') {
        const ai = getGeminiClient();
        const { modelUsed } = await generateWithGeminiFallback(ai, 'Ping: reply with "pong" only');
        const latency = Date.now() - startTime;
        res.json({
          reachable: true,
          provider: 'gemini',
          latencyMs: latency,
          message: `Connected successfully to ${modelUsed} (${latency}ms)`
        });
        return;
      }

      if (provider === 'custom_host') {
        if (!hostUrl) {
          res.status(400).json({ reachable: false, message: 'No host URL provided' });
          return;
        }
        const cleanHost = hostUrl.replace(/\/+$/, '');
        
        // If testing the local studio server itself
        if (cleanHost.includes(`:${PORT}`) || cleanHost === 'localhost' || cleanHost === 'http://localhost' || cleanHost === `http://localhost:${PORT}`) {
          res.json({
            reachable: true,
            provider: 'custom_host',
            hostUrl: cleanHost,
            status: 200,
            latencyMs: Date.now() - startTime,
            message: `Connected successfully to Local Studio Engine (HTTP 200 OK)`
          });
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        let responseStatus = 0;
        const pingCandidates = [
          `${cleanHost}/v1/models`,
          `${cleanHost}/models`,
          `${cleanHost}/api/health`,
          `${cleanHost}/api/tags`,
          cleanHost
        ];

        for (const testUrl of pingCandidates) {
          try {
            const resTest = await fetch(testUrl, {
              method: 'GET',
              headers: {
                'bypass-tunnel-reminder': 'true',
                'ngrok-skip-browser-warning': 'true',
              },
              signal: controller.signal
            });
            responseStatus = resTest.status;
            if (resTest.ok) {
              break;
            }
          } catch (e) {
            // ignore candidate error and try next
          }
        }

        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;

        if (responseStatus > 0) {
          const isOk = responseStatus >= 200 && responseStatus < 400;
          res.json({
            reachable: true,
            provider: 'custom_host',
            hostUrl: cleanHost,
            status: responseStatus,
            latencyMs: latency,
            message: isOk
              ? `Connected successfully (HTTP ${responseStatus} OK - ${latency}ms)`
              : `Reachable - Server active on port (HTTP ${responseStatus} - ${latency}ms)`
          });
        } else {
          res.status(500).json({
            reachable: false,
            latencyMs: latency,
            message: `Could not connect to ${cleanHost}. Ensure local server or tunnel is running.`
          });
        }
        return;
      }

      res.status(400).json({ reachable: false, message: 'Unknown provider' });
    } catch (err: any) {
      const latency = Date.now() - startTime;
      res.status(500).json({
        reachable: false,
        latencyMs: latency,
        message: err.message || 'Connection failed or timed out'
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(` ✅ CinemaScript Pro Server is active and READY!`);
    console.log(` 🌐 Open http://localhost:${PORT} in your browser`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
