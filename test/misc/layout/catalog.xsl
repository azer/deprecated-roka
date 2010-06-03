<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:i18n="roka.github.com/ns/i18n"
xmlns="http://www.w3.org/1999/xhtml">

<xsl:template match="/">
  <table id="catalog" border="1">
    <tr bgcolor="#9acd32">
      <th i18n:msgid='title'>$title</th>
      <th i18n:msgid='artist'>$artist</th>
    </tr>
    <xsl:for-each select="catalog/cd">
    <tr>
      <td><xsl:value-of select="title"/></td>
      <td><xsl:value-of select="artist"/></td>
    </tr>
    </xsl:for-each>
  </table>
</xsl:template>

</xsl:stylesheet>
