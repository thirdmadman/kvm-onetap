export const runTemplateCS1708i = (
  domain: string,
  isHttps: boolean,
  port: string,
  key: string,
  appPort: string,
  modelSecret: string,
  jarFilePath: string
) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<jnlp spec="1.0+" codebase="http${isHttps && 's'}://${domain}:${port}">
  <information>
    <title>JavaClient</title>
    <vendor>ATEN INTERNATIONAL CO., LTD.</vendor>
    <homepage href=""/>
    <description>JavaClient</description>
    <offline-allowed/>
  </information>
  <security><all-permissions/></security>
    <resources>
    <j2se version="1.5+" max-heap-size="128m" href="http://java.sun.com/products/autodl/j2se"></j2se>
        <jar eager="true" href="${jarFilePath}@pid=${key}" main="true"/>
    </resources>
    <application-desc main-class="iclientj.ClientApplet">
      <argument>${domain}</argument>
      <argument>${appPort}</argument>
      <argument>${key}</argument>
      <argument>${modelSecret}</argument>
    </application-desc>
</jnlp>`;
