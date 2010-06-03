import os,re

dir = './suites'

indexes = ['index.xml','indexb.xml']
files = [ ''.join( open('%s/%s'%(dir,file) ).readlines() ) for file in os.listdir(dir) if file.endswith('.xml') and indexes.count(file)==0  ]
pattern = '<case[\s\w\=\/\.\\]*>[\.\w\s<>=\"\'\/]+</case>'
content = ''
contentb = ''

for ind,fl in enumerate(files):
  try:
    case = re.findall(pattern,fl)[0]
    content = '%s\n  %s'%( content, case )
    contentb = '%s\n %s'%( contentb, re.sub( '<dependency[\s\w\=\/\.\"\\\']*>\n\s+', '', case ) )
  except:
    print('could not import %i',files[ind])

content = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="../testrunner.xsl"?>\n<testcases>\n%s\n</testcases>'''%content
contentb = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="../testrunner.xsl"?>\n<testcases>\n%s\n</testcases>'''%contentb

indexb = open('./suites/indexb.xml','w')
indexb.write(re.sub('</case>','<dependency src=\'../../build/version/latest/roka1.0rc13.js\' />\n</case>',contentb))
indexb.close()

index = open('./suites/index.xml','w')
index.write(content)
index.close()
