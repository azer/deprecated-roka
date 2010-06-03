"""
jsmake - javascript build utility
see sample manifest document in the project page to learn more.

http://github.com/azer/jsmake

Azer Koculu <azerkoculu@gmail.com>
Mon May 31 22:55:52 UTC 2010
"""
from yaml import load as yaml
from re import sub
from sys import argv as args
from jsmin import jsmin as minify

manifest = None

def load(path):
  return yaml( open( path ) )

def merge(manifest):
  return '\n'.join( map( read, manifest['files'] ) )

def process(content):
  for rpl in manifest['replacements']:
    content = sub(rpl['pattern'],rpl['replacement']%manifest['dict'],content)
  return content

def put(content):
  fl = open('%s/%s'%(manifest['dir']%manifest['dict'],manifest['filename']%manifest['dict']),'w')
  fl.write(content)
  fl.close()
  return content

def read(path):
  fl = open(path)
  content = fl.read()
  fl.close()
  return content

if __name__ == '__main__' and len(args)>1:
  manifest = load(args[1])
  put(minify(process(merge(manifest))))
