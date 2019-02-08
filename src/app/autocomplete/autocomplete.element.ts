import { MatcherFunction } from '../utility';
import { DropdownElement } from './dropdown.element';

/** create template */

let tmpl = document.createElement('template');

tmpl.innerHTML = `
<link
  rel="stylesheet"
  href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
  integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
  crossorigin="anonymous"
/>

<!-- Bootstrap CSS -->
<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
  integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
  crossorigin="anonymous"
/>
<div class="autocomplete">
    <label for="autocomplete">XXX</label>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">
                <i></i>
            </span>
        </div>
        <input
            id="autocomplete"
            type="text"
            class="form-control"
            placeholder="xxx"
            required />
    </div>
</div>
`;

/**
 * Create a class for the element
 */
export class AutocompleteElement<T> extends HTMLElement {
  private shadow: ShadowRoot;
  private dropdownElement: DropdownElement<T>;

  set matcherFunction(matcher: MatcherFunction<T>) {
    this.dropdownElement.matcherFunction = matcher;
  }

  set selectItemFunction(fct: (item: T) => void) {
    this.dropdownElement.selectItemFunction = fct;
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    this.shadow = this.attachShadow({ mode: 'open' });

    // Attach the template to the shadow dom
    this.shadow.appendChild(tmpl.content.cloneNode(true));

    this.dropdownElement = new DropdownElement(
      this.shadow.querySelector('div')
    );

    this.render();
  }

  render() {
    // define label
    const labelElt = this.shadow.querySelector('label');
    labelElt.innerHTML = this.getAttribute('label');

    // define icon
    const iconElt = this.shadow.querySelector('i');
    const iconClasses = this.getAttribute('icon');
    if (iconClasses) {
      iconClasses.split(' ').forEach(icon => iconElt.classList.add(icon));
    }

    // define placeholder
    const placeholder = this.getAttribute('placeholder');
    const input = this.shadow.querySelector('input');
    input.placeholder = placeholder ? placeholder : '';
  }

  /* Attributes to monitor */
  static get observedAttributes() {
    return ['type', 'button'];
  }

  /* Called when the element is inserted into a document */
  connectedCallback() {}

  /* Called when the element is removed from a document */
  disconnectedCallback() {}

  /* Called when the element is adopted to another document */
  /* adoptedCallback(oldDocument, newDocument) {} */

  /* Respond to attribute changes */
  attributeChangedCallback(attr: any, oldValue: any, newValue: any) {}
}
