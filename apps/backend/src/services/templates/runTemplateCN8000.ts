export const runTemplateCN8000 = (
  domain: string,
  isHttps: boolean,
  port: string,
  key: string,
  appPort: string,
  modelSecret: string,
  jarFilePath: string
) =>
  `<?xml version="1.0" encoding="utf-8"?><jnlp spec="1.0+" codebase="http${isHttps && 's'}://${domain}:${port}"><information><title>JavaClient</title> 
<vendor>CN8000</vendor><homepage href="http://www.aten.com/"/><description>JavaClient</description></information>
<security><all-permissions/></security><resources><j2se version="1.5+" max-heap-size="128m" href="http://java.sun.com/products/autodl/j2se">
</j2se><jar href="${jarFilePath}" main="true"/></resources><application-desc main-class="iclientj.ClientFrame">
<argument>ConnID=${key}</argument><argument>ServPt=${appPort}</argument>
<argument>Username=user</argument><argument>Host=${domain}</argument></application-desc></jnlp>`;