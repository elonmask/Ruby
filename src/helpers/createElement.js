export const createElement = ({
	type,
	attributes,
	classes,
	listeners,
	id,
	style,
}) => {
	const element = document.createElement(type)
	
	if (attributes) {
		setAttributes(element, attributes)
	}

	if (classes) {
		setClasses(element, classes)
	}

	if (listeners) {
		addListeners(element, listeners)
	}

	if (id) {
		setId(element, id)
	}

	if (style) {
		setStyle(element, style)
	}

	return element
}

const setAttributes = (element, attr) => {
	attr.forEach(({ name, value }) => element.setAttribute(name, value))
}

const setClasses = (element, classes) => {
	classes.forEach(currentClass => element.classList.add(currentClass))
}

const addListeners = (element, listeners) => {
	listeners.forEach(({ event, cb }) => element.addEventListener(event, cb))
}

const setId = (element, id) => {
	element.id = id
}

const setStyle = (element, style) => {
	Object.keys(style).forEach(key => {
		element.style[key] = style[key]
	})
}
