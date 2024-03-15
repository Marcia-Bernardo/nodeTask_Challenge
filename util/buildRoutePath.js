export function buildRoutePath(url) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = url.replaceAll(
    routeParametersRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
