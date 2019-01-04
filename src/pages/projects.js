import React, { useState, useEffect } from 'react'
import marked from 'marked'

export default function Projects () {
  const [content, setContent] = useState('loading...')

  useEffect(() => {
    fetch('/projects.md')
      .then(response => response.text())
      .then(text => setContent(text))
  })

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(content)
      }}
    ></div>
  )
}
