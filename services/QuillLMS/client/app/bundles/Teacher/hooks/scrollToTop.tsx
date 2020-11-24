import * as React from 'react'

export function scrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}
