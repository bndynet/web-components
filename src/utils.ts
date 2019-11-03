export function getElementStyle(elem: any, cssRole: string): any {
	var value = '';
	if(document.defaultView && document.defaultView.getComputedStyle){
		value = document.defaultView.getComputedStyle(elem, '').getPropertyValue(cssRole);
	}
	else if(elem.currentStyle){
		cssRole = cssRole.replace(/\-(\w)/g, (match, p1) => {
			return p1.toUpperCase();
		});
		value = elem.currentStyle[cssRole];
	}
	return value;
}
