export function createDocUrlTransform(docPath: string): (url: string) => string {
  const readmeUrl = new URL(docPath, import.meta.env.VITE_DOCS_BASE_URL);
  const baseDirectory = new URL(".", readmeUrl);

  return (url: string) => {
    if (url.length === 0 || url.startsWith("#")) {
      return url;
    }

    try {
      const resolved = new URL(url, baseDirectory);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        return resolved.href;
      }
      return "";
    } catch {
      return "";
    }
  };
}
