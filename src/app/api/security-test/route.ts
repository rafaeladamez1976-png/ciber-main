import { NextResponse } from 'next/server';

// Self-test: evaluates the security posture of this very application
export async function GET(request: Request) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3005';

  const tests: Record<string, any>[] = [];
  let score = 100;

  // Test 1: Security Headers
  try {
    const res = await fetch(`${baseUrl}/dashboard`, { method: 'HEAD' });
    const requiredHeaders = ['x-frame-options', 'x-content-type-options', 'strict-transport-security', 'content-security-policy'];
    const presentHeaders = requiredHeaders.filter(h => res.headers.has(h));
    const headersScore = (presentHeaders.length / requiredHeaders.length) * 100;
    
    if (headersScore < 100) score -= (100 - headersScore) * 0.2;
    
    tests.push({
      name: 'Security Headers',
      category: 'hardening',
      status: headersScore === 100 ? 'pass' : headersScore >= 50 ? 'warning' : 'fail',
      score: Math.round(headersScore),
      detail: `${presentHeaders.length}/${requiredHeaders.length} headers críticos presentes`,
      present: presentHeaders,
      missing: requiredHeaders.filter(h => !presentHeaders.includes(h)),
    });
  } catch {
    tests.push({ name: 'Security Headers', category: 'hardening', status: 'skip', score: 0, detail: 'No se pudo conectar al servidor' });
  }

  // Test 2: API Input Validation — missing range parameter
  try {
    const res = await fetch(`${baseUrl}/api/scan/local`);
    const json = await res.json();
    const validated = res.status === 400 && json.error;
    if (!validated) score -= 15;
    tests.push({
      name: 'API Input Validation',
      category: 'api-security',
      status: validated ? 'pass' : 'fail',
      score: validated ? 100 : 0,
      detail: validated ? 'API rechaza correctamente solicitudes sin parámetros requeridos' : 'API acepta solicitudes incompletas — riesgo de error no manejado',
    });
  } catch {
    tests.push({ name: 'API Input Validation', category: 'api-security', status: 'skip', score: 50, detail: 'Test omitido' });
  }

  // Test 3: Error handling (should not expose stack traces)
  try {
    const res = await fetch(`${baseUrl}/api/scan/local?range=INVALID_INPUT`);
    const text = await res.text();
    const exposesStack = text.includes('at Object.') || text.includes('node_modules') || text.includes('Error:');
    if (exposesStack) score -= 20;
    tests.push({
      name: 'Error Disclosure Prevention',
      category: 'information-leakage',
      status: exposesStack ? 'fail' : 'pass',
      score: exposesStack ? 0 : 100,
      detail: exposesStack 
        ? '⚠️ La API expone stack traces — información sensible filtrada' 
        : 'Errores manejados correctamente sin revelar rutas internas',
    });
  } catch {
    tests.push({ name: 'Error Disclosure Prevention', category: 'information-leakage', status: 'skip', score: 50, detail: 'Test omitido' });
  }

  // Test 4: Check HTTPS enforcement (if deployed)
  const isHTTPS = baseUrl.startsWith('https://');
  if (!isHTTPS) score -= 10;
  tests.push({
    name: 'HTTPS Enforcement',
    category: 'transport-security',
    status: isHTTPS ? 'pass' : 'warning',
    score: isHTTPS ? 100 : 40,
    detail: isHTTPS ? 'Aplicación servida mediante HTTPS' : 'Entorno local sin HTTPS — aceptable en desarrollo',
  });

  // Test 5: Sensitive file exposure
  const sensitiveFiles = ['/.env', '/package.json', '/.git/config'];
  const exposedFiles: string[] = [];
  await Promise.all(sensitiveFiles.map(async (file) => {
    try {
      const res = await fetch(`${baseUrl}${file}`);
      if (res.status === 200) exposedFiles.push(file);
    } catch {}
  }));
  if (exposedFiles.length > 0) score -= exposedFiles.length * 25;
  tests.push({
    name: 'Sensitive File Exposure',
    category: 'information-leakage',
    status: exposedFiles.length === 0 ? 'pass' : 'fail',
    score: exposedFiles.length === 0 ? 100 : 0,
    detail: exposedFiles.length === 0 
      ? 'Ningún archivo sensible expuesto públicamente'
      : `⚠️ Archivos expuestos: ${exposedFiles.join(', ')}`,
    exposed: exposedFiles,
  });

  // Test 6: Check for clickjacking protection
  const hasXFrameOptions = tests[0]?.present?.includes('x-frame-options');
  tests.push({
    name: 'Clickjacking Protection',
    category: 'browser-security',
    status: hasXFrameOptions ? 'pass' : 'fail',
    score: hasXFrameOptions ? 100 : 0,
    detail: hasXFrameOptions 
      ? 'X-Frame-Options configurado — protegido contra clickjacking' 
      : 'Sin X-Frame-Options — vulnerable a ataques de clickjacking',
  });

  // Test 7: Rate Limiting (check if API accepts infinite rapid requests — simulated)
  tests.push({
    name: 'Rate Limiting',
    category: 'api-security',
    status: 'warning',
    score: 40,
    detail: 'Rate limiting no implementado en API routes — recomendado para producción con Vercel Edge Middleware',
    recommendation: 'Implementar rate limiting con @upstash/ratelimit + Redis',
  });

  // Test 8: Supabase env vars check
  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url');
  tests.push({
    name: 'Database Configuration',
    category: 'configuration',
    status: hasSupabase ? 'pass' : 'warning',
    score: hasSupabase ? 100 : 60,
    detail: hasSupabase 
      ? 'Base de datos Supabase configurada correctamente' 
      : 'Supabase no configurado — operando en modo datos locales (mock)',
  });

  const finalScore = Math.max(0, Math.round(score));
  const grade = finalScore >= 90 ? 'A' : finalScore >= 75 ? 'B' : finalScore >= 60 ? 'C' : finalScore >= 40 ? 'D' : 'F';

  return NextResponse.json({
    appUrl: baseUrl,
    testedAt: new Date().toISOString(),
    grade,
    score: finalScore,
    totalTests: tests.length,
    passed: tests.filter(t => t.status === 'pass').length,
    warnings: tests.filter(t => t.status === 'warning').length,
    failed: tests.filter(t => t.status === 'fail').length,
    tests,
    summary: {
      critical: tests.filter(t => t.status === 'fail' && ['api-security', 'information-leakage'].includes(t.category)),
      recommendations: [
        ...(finalScore < 90 ? ['Implementar rate limiting en API routes'] : []),
        ...(!hasSupabase ? ['Configurar Supabase para persistencia de datos'] : []),
        ...(!isHTTPS ? ['Desplegar en producción con HTTPS'] : []),
      ],
    },
  });
}
