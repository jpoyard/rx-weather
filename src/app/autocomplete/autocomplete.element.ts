import { EventEmitter } from 'events';
import { copy, MatcherFunction, MatchingItem } from '../utility';

declare interface HtmlItem<T> {
  label: string;
  value: T;
  element: HTMLElement;
}

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
<style>${require('./autocomplete.element.css')}</style>
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
    <div class="autocomplete-items">
    </div>
</div>
`;

/**
 * Create a class for the element
 */
export class AutocompleteElement<T> extends HTMLElement {
  private currentFocus = -1;
  private shadow: ShadowRoot;
  private items: HtmlItem<T>[] = [];
  private itemsContainer: HTMLElement;
  private itemsMap: Map<string, HtmlItem<T>> = new Map<string, HtmlItem<T>>();
  private inputElement: HTMLInputElement;

  private _selectItem: EventEmitter = new EventEmitter();
  public get selectItem(): EventEmitter {
    return this._selectItem;
  }

  private _matcherFunction: MatcherFunction<T>;
  set matcherFunction(matcher: MatcherFunction<T>) {
    this._matcherFunction = matcher;
  }
  get matcherFunction(): MatcherFunction<T> {
    return this._matcherFunction;
  }

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    this.shadow = this.attachShadow({ mode: 'open' });

    // Attach the template to the shadow dom
    this.shadow.appendChild(tmpl.content.cloneNode(true));

    this.itemsContainer = this.shadow.querySelector('.autocomplete-items');
    this.inputElement = this.shadow.querySelector('input');

    /*execute a function when someone writes in the text field:*/
    this.inputElement.addEventListener(
      'input',
      this.inputChangeListener.bind(this)
    );

    document.addEventListener('click', this.documentClickListener.bind(this));

    /*execute a function presses a key on the keyboard:*/
    this.inputElement.addEventListener(
      'keydown',
      this.inputKeyDownListener.bind(this)
    );

    this.update();
  }

  public inputChangeListener() {
    const term = this.inputElement.value;

    this.matcherFunction(term)
      .then(
        resolve => {
          this.createItemsList(term, resolve.slice(0, 10));
        },
        reject => {
          this.cleanItems();
          console.error(reject);
        }
      )
      .catch(err => {
        console.error(err);
      });
  }

  /**
   * keyboard event
   * @param event
   */
  public inputKeyDownListener(event: KeyboardEvent) {
    if (event.keyCode === 40) {
      /**
       * If the arrow DOWN key is pressed, increase the currentFocus variable:
       **/
      this.currentFocus++;
      /**
       * and and make the current item more visible:
       */
      this.addActive();
    } else if (event.keyCode === 38) {
      /**
       * If the arrow UP key is pressed, decrease the currentFocus variable:
       */
      this.currentFocus--;
      /**
       *  and and make the current item more visible:
       **/
      this.addActive();
    } else if (event.keyCode === 13) {
      /**
       * If the ENTER key is pressed, prevent the form from being submitted,
       **/
      event.preventDefault();
      if (this.currentFocus > -1) {
        /**
         * and simulate a click on the "active" item:
         **/
        this.items[this.currentFocus].element.click();
      }
    }
  }

  public documentClickListener(event: MouseEvent) {
    if (event.target !== this.inputElement) {
      this.cleanItems(event.target);
    } else {
      this.inputChangeListener();
    }
  }

  /**
   * a function to classify an item as "active"
   */
  private addActive() {
    /**
     * start by removing the "active" class on all items:
     **/
    this.removeActive();
    if (this.currentFocus >= this.items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = this.items.length - 1;
    /**
     * add class "autocomplete-active":
     */
    this.items[this.currentFocus].element.classList.add('autocomplete-active');
  }

  /**
   * a function to remove the "active" class from all autocomplete items:
   */
  private removeActive() {
    this.items.forEach(item =>
      item.element.classList.remove('autocomplete-active')
    );
  }

  public createItemsList(
    term: string,
    matchingList: MatchingItem<T>[]
  ): boolean {
    this.currentFocus = -1;
    this.cleanItems();

    if (!term) {
      return false;
    }

    /**
     * Create an element for each matching element
     */
    this.items = matchingList
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      })
      .map(item => this.addItem(item, term));

    this.itemsMap = this.items.reduce(
      (acc, item) => acc.set(item.label, item),
      new Map<string, HtmlItem<T>>()
    );
    return;
  }

  /**
   * create an item html element according to giving value
   * @param item value to display
   * @param term user query
   */
  public addItem(item: MatchingItem<T>, term: string): HtmlItem<T> {
    const htmlItem = document.createElement('DIV');
    htmlItem.classList.add('autocomplete-item');
    /**
     * make the matching letters bold
     **/
    const position = Math.max(
      0,
      item.label.toUpperCase().search(term.toUpperCase())
    );
    if (position > 0) {
      htmlItem.innerHTML += item.label.substr(0, position);
    }
    htmlItem.innerHTML += `<strong>${item.label.substr(
      position,
      term.length
    )}</strong>`;
    htmlItem.innerHTML += item.label.substr(position + term.length);
    /**
     * insert a input field that will hold the current array item's value
     */
    htmlItem.innerHTML += `<input type='hidden' value='${item.label}'>`;
    /**
     * add event listener
     */
    htmlItem.addEventListener('click', this.itemClickListener.bind(this));
    return {
      label: item.label,
      value: copy(item.value),
      element: this.itemsContainer.appendChild(htmlItem)
    };
  }

  public removeItem(label: string) {
    if (this.itemsMap.has(label)) {
      const item = this.itemsMap.get(label);
      item.element.removeEventListener(
        'click',
        this.itemClickListener.bind(this)
      );
      this.itemsContainer.removeChild(item.element);
      this.itemsMap.delete(label);
    }
  }

  /**
   * Listener on item mouse click
   * @param event
   */
  public itemClickListener(event: MouseEvent) {
    const result = (event.target as HTMLElement).getElementsByTagName('input');
    const value = result && result.length > 0 ? result[0].value : null;
    if (this.itemsMap.has(value)) {
      const item = this.itemsMap.get(value);
      this.inputElement.value = item.label;
      this._selectItem.emit('select', item.value);
      this.cleanItems();
    }
  }

  /**
   * remove all autocomplete items
   */
  private cleanItems(target?: EventTarget) {
    if (!target || target !== this.inputElement) {
      Array.from(this.itemsMap.values()).forEach(item => {
        this.removeItem(item.label);
      });
      this.itemsContainer.innerHTML = '';
    }
  }

  update() {
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
