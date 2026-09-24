import { transformSync } from 'rolldown/experimental';

export const resolve = async (specifier, context, nextResolve) => {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND' && (specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      for (const ext of ['.js', '.jsx']) {
        const resolved = await nextResolve(specifier + ext, context).catch(() => null);
        if (resolved) return resolved;
      }
    }
    throw error;
  }
};

export const load = async (url, context, nextLoad) => {
  if (!url.endsWith('.jsx')) return nextLoad(url, context);
  const { source } = await nextLoad(url, { ...context, format: 'module' });
  const { code, errors } = transformSync(url, String(source), { jsx: { runtime: 'automatic' } });
  if (errors?.length) throw errors[0];
  return { format: 'module', source: code, shortCircuit: true };
};
