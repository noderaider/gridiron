export function getStyleProperties(props, sectionName) {
  const className = props.styles.getClassName({
    section: sectionName,
    classNames: props.styles.classNames,
    useClassNames: props.settings.useGriddleClassNames
  })

  const style = props.styles.getStyle({
    styles: props.styles.inlineStyles,
    styleName: sectionName,
    ...props.style
  })

  return { className, style }
}
