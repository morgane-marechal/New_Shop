/* 
* @license MIT
* boutique-en-ligne (maxaboom) 
* Copyright (c) 2023 Abraham Ukachi, Axel Vair, Morgane Marechal, Catherine Tranchand . The Maxaboom Project Contributors.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @name: Maxaboom App
* @codename: mbApp
* @type: Script
* @author: Abraham Ukachi <abraham.ukachi@laplateforme.io>
* @contributors: Axel Vair <axel.vair@laplateforme.io>, Morgane Marechal <morgane.marechal@laplateforme.io>, Catherine Tranchand <catherine.tranchand@laplateforme.io>
*
* Example usage:
*  
*   1-|> // show a toast message for 10 seconds
*    -|>
*    -|> mbApp.showToast({message: 'Hello World!'}, 10);
*    -|>
*
*/

// Import a couple of our own helpers
import { installMediaQueryWatcher } from './helpers/mediawatcher.js'; // <- media query watcher
import I18n from './helpers/i18n.js'; // <- i18n helper



"use strict"; 
// ^^^^^^^^^ This keeps us on our toes, as it forces us to use all pre-defined variables, among other things 😅


// Defining some constant variables...

// app name
export const APP_NAME = "Maxaboom";
// app version
export const APP_VERSION = "0.0.1";
// app authors
export const APP_AUTHORS = [
  {
    gh: "abraham-ukachi",
    name: "Abraham Ukachi",
    email: "abraham.ukachi@laplateforme.io"
  },
  {
    gh: "axel-vair",
    name: "Axel Vair",
    email: "axel.vair@laplateforme.io"
  },
  {
    gh: "morgane-marechal",
    name: "Morgane Marechal",
    email: "morgane.marechal@laplateforme.io"
  },
  {
    gh: "catherine-tranchand",
    name: "Catherine Tranchand",
    email: "catherine.tranchand@laplateforme.io"
  }
];


// toast types
export const ERROR_TOAST = 'et';
export const SUCCESS_TOAST = 'st';
export const GOOD_TOAST = '1t';
export const BAD_TOAST = '2t';
export const NORMAL_TOAST = '0t';
export const DEFAULT_TOAST = NORMAL_TOAST; // <- default toast type is normal
// default toast timeout
export const DEFAULT_TOAST_TIMEOUT = 5; // <- default toast timeout is 5 seconds
export const DEFAULT_MENU_TIMEOUT = 0.5;
export const DEFAULT_BACKDROP_TIMEOUT = 0.5;

// parts
export const MAIN_PART = '0p';
export const ASIDE_PART = '1p';
export const FULL_PART = '2p';
export const DEFAULT_PART = FULL_PART; // <- default part is full




/**
 * `html` tag function
 * Creating our very own `html` tag function for all template literals
 * for more info, [read this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
 *
 * @type { TagFunction } 
 */
export const html = (strings, ...values) => {

  // Treating/parsing the values...

  values = values.map((value) => {
    // Initialize a `result` variable
    let result = value;

    // If the value is an array...
    if (Array.isArray(value)) {
      // ...HACK: remove any trailing comma 
      // by joining their items with a space
      result = value.join(' ');
    }

    // return `result`
    return result;
  });

  // TEST: Log all the values
  // DEBUG [4dbsmaster]: tell me about all the values
  values.forEach((value, index) => console.log(`\x1b[42m\x1b[30m[html]: value at ${index} => \x1b[0m`, value));


  // return the raw strings including their values
  return String.raw({ raw: strings }, ...values);
};




// Create a `MaxaboomApp` class
export class MaxaboomApp {

  // Define some static properties

  // maxaboom authors ;)
  static get authors() {
    return APP_AUTHORS;
  }


  // TODO: Define some public properties


  // TODO: Define some private properties

  #page = 'home';
  #toasting = false;


  
  /**
   * Constructor of the App
   * NOTE: This constructor will be executed automatically when a new object (eg. mbApp) is created.
   *
   * @param { String } lang - The default language of the app
   * @param { String } theme - The default theme of the app
   */
  constructor(lang = 'en', theme = 'light') {
    
    // Initialize the `lang` and `theme` properties
    this.lang = lang;
    this.theme = theme;


    // create a new `I18n` instance with `lang` as the default language
    this.i18n = new I18n(lang);

    // when the data is loaded,
    // call the `onReady` method with the loaded data as parameter
    this.i18n.dataLoaded = (data) => this.onReady(data);

    // install event listeners of the app
    this._installEventListeners();

    // Install the Media Query Watcher
    installMediaQueryWatcher(460, 
      (firstNarrowQuery) => this._handleNarrowLayout(firstNarrowQuery), 
      (firstWideQuery) => this._handleWideLayout(firstWideQuery)
    );

  }


  /**
   * Method called whenever the app is ready
   * NOTE: This method will be called automatically when the app is ready
   * NOTE: User can override this method
   *
   * @param { Object } data - The loaded `i18n` data
   */
  onReady(data) {}

  // PUBLIC METHODS

  /**
   * Method used to display a toast message with the given `params`
   * NOTE: This method will automatically hide the toast after the given `timeout` (in seconds)
   *
   * Example usage:
   *    mbApp.showToast({message: 'Instrument added to cart', type: GOOD_TOAST, part: DEFAULT_PART}, 10);
   *
   * @param { Object } params - The toast parameters
   * @param { String } params.message - The message to display
   * @param { String } params.type - The type of the toast (eg. ERROR_TOAST, GOOD_TOAST, BAD_TOAST, NORMAL_TOAST)
   * @param { String } params.part - The part of the app where the toast will be displayed (eg. MAIN_PART, ASIDE_PART, FULL_PART) 
   *
   * @param { Number } timeout - The timeout (in seconds) after which the toast will be hidden
   * @param { Boolean } force - Whether to force the toast to be displayed or not
   */
  showToast(params, timeout = DEFAULT_TOAST_TIMEOUT, force = false) {
    // do nothing if the app is already toasting and if we don't want to force the toast
    if (this.#toasting && !force) { return }
    
    // Initialize some variables...

    // get the toast `message` from `params`
    let message = params.message;

    // get the toast `type` from `params`
    let type = params.type ?? DEFAULT_TOAST; 

    // get the toast `part` from `params`
    let part = params.part ?? DEFAULT_PART;
    


    // get the current toasts element form the given `part` as `currentToastsEl`
    let currentToastsEl = (part === MAIN_PART) ? this.mainToastsEl : (part === ASIDE_PART ? this.asideToastsEl : this.toastsEl);
    
    // Clearing / reseting up our toast...
    this._clearToast(currentToastsEl);


    // set toasting to TRUE
    this.#toasting = true;

    // get a toast html template with these params as `toastHtmlTemplate`
    let toastHtmlTemplate = this._getToastHtmlTemplate(type, message);

    // insert `toastHtmlTemplate` to `currentToastsEl`
    currentToastsEl.insertAdjacentHTML('beforeend', toastHtmlTemplate);

    // get the added toast element as `toastEl`
    let toastEl = currentToastsEl.querySelector('.toast');

    // unhide the `currentToastsEl`
    currentToastsEl.hidden = false;

    // Fade out the toast element
    this._fadeToastOut(toastEl, timeout).then(() => {

      // set / create a new `_toastTimer`
      this._toastTimer = setTimeout(() => {
        // Clearing / reseting up our toast...
        this._clearToast(currentToastsEl);

        // set toasting to FALSE
        this.#toasting = false;
        
        // remove the toast element
        toastEl.remove();

        // hide the `currentToastsEl`
        currentToastsEl.hidden = true;

      }, timeout * 500);

    });

  }

  

  /**
   * Method used to show the menu with the given `menuId`
   *
   * @param { String } menuId - The id of the menu to show
   * @param { Number } duration - The duration of the animation (in seconds)
   * @param { String } part - The part of the app where the menu will be displayed (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Promise } - A promise that will be resolved when the menu is shown
   */
  showMenuById(menuId, duration = 0.5, part = DEFAULT_PART) {
    return new Promise((resolve, reject) => {
      // get the menus element of the given `part` as `menusEl`
      // TODO: Rename `menusEl` to `menusContainerEl`
      let menusEl = this.getCurrentMenusElement(part);

      // get the menu element with the given `menuId` as `menuEl`
      let menuEl = menusEl.querySelector(`[data-id="${menuId}"]`);

      // if the menu element doesn't exist, reject the promise
      if (!menuEl) { return reject(`Menu with id "${menuId}" doesn't exist`) }


      // show the backdrop of the given `part` 
      this.showBackdropOf(part);


      // unhide the `menuEl`
      menuEl.hidden = false;

      // unhide the `menusEl`
      menusEl.hidden = false;

      // remove the `fade-out` class from `menusEl`
      menusEl.classList.remove('fade-out');
      // add the `fade-in` class to `menusEl`
      menusEl.classList.add('fade-in');

      // remove the `slide-down` class from `menuEl`
      menuEl.classList.remove('slide-down');
      // add the `slide-from-down` class to `menuEl`
      menuEl.classList.add('slide-from-down');

      // cancel any active timers
      clearTimeout(this._showMenuTimer);
      clearTimeout(this._hideMenuTimer);
      
      // resolve the promise after `duration` seconds
      this._showMenuTimer = setTimeout(() => {
        // TODO ? Do something before resolving the promise

        // activate the menu element`
        menuEl.setAttribute('active', '');

        // resolve the promise
        return resolve();

        // remove the `fade-in` class from `currentMenusEl`
        // currentMenusEl.classList.remove('fade-in');
        
        // remove the `slide-from-down` class from `menuEl`
        // menuEl.classList.remove('slide-from-down');

        // hide `currentMenusEl`
        // currentMenusEl.hidden = true;
      }, duration * 1000);


      // show the menu element with the given `duration`
      // this._showMenu(menuEl, duration);

    });
  }



  /**
   * Method used to hide the menu with the given `menuId`
   *
   * @param { String } menuId - The id of the menu to hide
   * @param { Number } duration - The duration of the animation (in seconds)
   * @param { String } part - The part of the app where the menu will be hidden (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   * 
   * @returns { Promise } - A promise that will be resolved when the menu is hidden
   */
  hideMenuById(menuId, duration = 0.5, part = DEFAULT_PART) {
    return new Promise((resolve, reject) => {
      // get the menus element of the given `part` as `menusEl`
      let menusEl = this.getCurrentMenusElement(part);

      // get the menu element with the given `menuId` as `menuEl`
      let menuEl = this.getMenuById(menuId, part); 

      // if the menu element doesn't exist, reject the promise
      if (!menuEl) { return reject(`Menu with id "${menuId}" doesn't exist`) }


      // hide the backdrop of the given `part` 
      this.hideBackdropOf(part);
      

      // remove the `fade-in` class from `menusEl`
      menusEl.classList.remove('fade-in');
      // add the `fade-out` class to `menusEl`
      menusEl.classList.add('fade-out');

      // remove slide-from-down class from `menuEl`
      menuEl.classList.remove('slide-from-down');
      // add the `slide-down` class to `menuEl`
      menuEl.classList.add('slide-down');

      // cancel any active timers
      clearTimeout(this._hideMenuTimer);
      clearTimeout(this._showMenuTimer);

      // resolve the promise after `duration` seconds
      this._hideMenuTimer = setTimeout(() => {
        // TODO ? Do something before resolving the promise

        // deactivate the menu element`
        menuEl.removeAttribute('active');

        // hide the `menuEl`
        menuEl.hidden = true;

        // hide the `menusEl`
        menusEl.hidden = true;

        // DEBUG [4dbsmaster]: tell me about it ;)
        console.log(`\x1b[54m[hideMenuId](_hideMenuTimer): menuEl ==> \x1b[0m`, menuEl);

        // resolve the promise
        resolve();

      }, duration * 1000);

    });

  }


  /**
   * Method used to toggle the menu with the given `menuId`
   *
   * @param { String } menuId - The id of the menu to toggle
   * @param { Number } duration - The duration of the animation (in seconds)
   * @param { String } part - The part of the app where the menu will be toggled (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { False|Promise } - A promise that will be resolved when the menu is toggled
   */
  toggleMenuById(menuId, duration = 0.5, part = DEFAULT_PART) {
    // do nothing if the menu with the given `menuId` doesn't exist
    if (!this.getMenuById(menuId, part)) { return }

    // IDEA: If the menu is shown, hide it, else show it

    if (this.isMenuShownById(menuId, part)) {
      return this.hideMenuById(menuId, duration, part);
    }else {
      return this.showMenuById(menuId, duration, part);
    }

  }

  
  /**
   * Method used to open a dialog using the given `params`
   *
   * @param { Object } params - The params object
   *
   * @param { String } params.title - The title of the dialog
   * @param { String } params.message - The message of the dialog
   * @param { String } params.confirmBtnText - The text of the confirm button
   * @param { String } params.cancelBtnText - The text of the cancel button
   * @param { Boolean } params.noDivider - Whether to hide the divider between the buttons
   * @param { Function } params.onConfirm - The function to call when the confirm button is clicked
   * @param { Function } params.onCancel - The function to call when the cancel button is clicked
   * 
   * @returns { Promise } - A promise that will be resolved when the dialog is opened
   */
  openDialog(params, timeout = 0.5, part = DEFAULT_PART) {
    return new Promise ((resolve, reject) => {
      // get the dialogs element of the given `part` as `dialogsEl`
      let dialogsEl = this.getCurrentDialogsElement(part);

      // initialize the `dialogId` variable
      let dialogId = params.id || 'dialog';

      // if the `dialogId` is `dialog`...
      if (dialogId === 'dialog') {
        // ...get the dialog html template with the given `params` as `dialogHTMLTemplate`
        let dialogHTMLTemplate = this._getDialogHTMLTemplate(params);
        // ...insert 'beforend' the `dialogHTMLTemplate` to `dialogsEl`
        dialogsEl.insertAdjacentHTML('beforeend', dialogHTMLTemplate);
      }

      // get the dialog element using `dialogId`
      let dialogEl = this.getDialogById(dialogId, part);

      // if the dialog element doesn't exist, reject the promise
      if (!dialogEl) { reject(`Dialog with id "${dialogId}" doesn't exist`); }

      // show the backdrop of the given `part` 
      this.showBackdropOf(part);

      // show or unhide the `dialogsEl`
      dialogsEl.hidden = false;
      // show or unhide the `dialogEl`
      dialogEl.hidden = false;

      // remove the `fade-out` class from `dialogsEl`
      dialogsEl.classList.remove('fade-out');
      // add the `fade-in` class to `dialogsEl`
      dialogsEl.classList.add('fade-in');

      // remove the `slide-down` class from `dialogEl`
      dialogEl.classList.remove('slide-down');
      // add the `slide-from-down` class to `dialogEl`
      dialogEl.classList.add('slide-from-down');

      
      // cancel any active timers
      clearTimeout(this._hideDialogTimer);
      clearTimeout(this._showDialogTimer);

      // resolve the promise after `duration` seconds
      this._showDialogTmer = setTimeout(() => {
        // TODO ? Do something before resolving the promise

        // add a `opened` property to `dialogEl`
        dialogEl.setAttribute('opened', '');

        // resolve the promise
        resolve(dialogEl);

      }, timeout * 1000);

    });
  }

  /**
   * Method used to check if the menu with the given `menuId` is shown
   *
   * @param { String } menuId - The id of the menu to check
   * @param { String } part - The part of the app where the menu will be checked (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Boolean } - A boolean that will be true if the menu is shown, false otherwise
   */
  isMenuShownById(menuId, part = DEFAULT_PART) {
    // get the menu element with the given `menuId` as `menuEl`
    let menuEl = this.getMenuById(menuId, part);

    // if the menu element doesn't exist, return false
    if (!menuEl) { return false }

    // return the opposite of the `hidden` attribute of the `menuEl`
    return !menuEl.hidden;
  }


  /**
   * Method used to show the side bar
   */
  showSideBar() {
    // if there's a side bar element, then unhide or show it
    if (this.hasSideBar) this.sideBarEl.hidden = false;
  }


  /**
   * Method used to hide the side bar
   */
  hideSideBar() {
    // if there's a side bar element, then hide it
    if (this.hasSideBar) this.sideBarEl.hidden = true;
  }


  /**
   * Method used to show the nav bar
   */
  showNavBar() {
    // if there's a nav bar element, then unhide or show it
    if (this.hasNavBar) this.navBarEl.hidden = false;
  }


  /**
   * Method used to hide the nav bar
   */
  hideNavBar() {
    // if there's a nav bar element, then hide it
    if (this.hasNavBar) this.navBarEl.hidden = true;
  }



  /**
   * Opens the `<aside>` part of the app
   *
   * @param { Number } duration - The duration (in milliseconds) of the opening animation
   *
   * @returns { Promise } - A promise that resolves when the aside is opened
   */
  openAside(duration = 300) {
    return new Promise((resolve, reject) => {
      // show the aside part
      this.showAsidePart();

      // open the aside by adding a `opened` attribute to it
      this.asideEl.setAttribute('opened', '');

      // create a open aside timer
      this.openAsideTimer = setTimeout(() => {
        
        // resolve the promise
        resolve();
      }, duration);
    });
  }


  /**
   * Closes the `<aside>` part of the app
   *
   * @param { Number } duration - The duration (in milliseconds) of the closing animation
   *
   * @returns { Promise } - A promise that resolves when the aside is closed
   */
  closeAside(duration = 300) {
    return new Promise((resolve, reject) => {
      // close the aside by adding the `closing` attribute to it
      this.asideEl.setAttribute('closing', '');

      // create a close aside timer
      this.closeAsideTimer = setTimeout(() => {
        // remove the `opened` attribute from the aside
        this.asideEl.removeAttribute('opened');
        // remove the `closing` attribute from the aside
        this.asideEl.removeAttribute('closing');

        // hide the aside part
        this.hideAsidePart();

        // resolve the promise
        resolve();
      }, duration);
    });

  }


  /**
   * Shows or unhides the aside part of the app
   */
  showAsidePart() {
    this.asideEl.hidden = false;
  }


  /**
   * Hides the aside part of the app
   */
  hideAsidePart() {
    this.asideEl.hidden = true;
  }


  /**
   * Shows or unhides the backdrop of the app (or a specific part of the app)
   *
   * @param { String } part - The part of the app to show the backdrop of
   */
  showBackdropOf(part = DEFAULT_PART) {
    // get the correct backdrop element
    let backdropEl = part === MAIN_PART ? this.mainBackdropEl : (part === ASIDE_PART ? this.asideBackdropEl : this.backdropEl);
    // set the `hidden` attribute to false 
    backdropEl.hidden = false;
  }


  /**
   * Hides the backdrop of the app (or a specific part of the app)
   *
   * @param { String } part - The part of the app to show the backdrop of
   * @param { Number } duration - The duration (in milliseconds) of the hiding animation
   */
  hideBackdropOf(part = DEFAULT_PART, duration = 300) {
    // get the correct backdrop element
    let backdropEl = part === MAIN_PART ? this.mainBackdropEl : (part === ASIDE_PART ? this.asideBackdropEl : this.backdropEl);

    // DEBUG [4dbsmaster]: tell me about it ;)
    console.log(`\x1b[34m[hideBackdropOf]: backdropEl => \x1b[0m`, backdropEl);

    // add the `fade-out` class to the backdrop element
    backdropEl.classList.add('fade-out');

    // hide the backdrop element after 300 milliseconds
    this.hideBackdropTimer = setTimeout(() => {
      // set the `hidden` attribute to true 
      backdropEl.hidden = true;
      // remove the `fade-out` class from the backdrop element
      backdropEl.classList.remove('fade-out');
    }, duration);

  }


  /**
   * Toggles the default backdrop of the app
   */
  toggleBackdrop() {
    // if the backdrop is hidden, then show it
    if (this.backdropEl.hidden) this.showBackdropOf(DEFAULT_PART);
    // if the backdrop is not hidden, then hide it
    else this.hideBackdropOf(DEFAULT_PART);
  }

  /**
   * Toggles the backdrop in the main part of the app
   */
  toggleMainBackdrop() {
    // if the backdrop is hidden, then show it
    if (this.mainBackdropEl.hidden) this.showBackdropOf(MAIN_PART);
    // if the backdrop is not hidden, then hide it
    else this.hideBackdropOf(MAIN_PART);
  }

  /**
   * Toggles the backdrop in the aside part of the app
   */
  toggleAsideBackdrop() {
    // if the backdrop is hidden, then show it
    if (this.asideBackdropEl.hidden) this.showBackdropOf(ASIDE_PART);
    // if the backdrop is not hidden, then hide it
    else this.hideBackdropOf(ASIDE_PART);
  }


  // PUBLIC SETTERS

  /**
   * Sets the current page
   *
   * @param { String } page - The page to set
   */
  setCurrentPage(page) {
    this.#page = page;
  }


  /**
   * Sets the app's title with the given `title`
   *
   * @param { String } title - The title to set
   * @param { Boolean } withAppName - Whether to append the app name to the title or not
   */
  setTitle(title, withAppName = false) {
    // Update the documents's title,
    // using our beloved ternary statement ;)
    document.title = withAppName ? `${title} | ${APP_NAME}` : title;
  }

  // PUBLIC GETTERS

  /**
   * Returns the current page
   *
   * @returns { String } - The current page
   */
  getCurrentPage() {
    return this.#page;
  }

  /**
   * Returns the app's title
   *
   * @param { Boolean } withoutAppName - Whether to remove the app name from the title or not
   */
  getTitle(withoutAppName = false) {
    // Return the documents's title,
    // using our beloved ternary statement ;)
    return withoutAppName ? document.title.replace(` | ${APP_NAME}`, '') : document.title;
  }


  /**
   * Returns the current menus element of the given `part`
   *
   * @param { String } part - The part of the app where the menu will be shown (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Element } - The current menus element of the given `part`
   */
  getCurrentMenusElement(part = DEFAULT_PART) {
    return (part === MAIN_PART) ? this.mainMenusEl : (part === ASIDE_PART ? this.asideMenusEl : this.menusEl);
  }


  /**
   * Returns the current dialogs element of the given `part`
   *
   * @param { String } part - The part of the app where the dialog will be shown (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Element } - The current dialogs element of the given `part`
   */
  getCurrentDialogsElement(part = DEFAULT_PART) {
    return (part === MAIN_PART) ? this.mainDialogsEl : (part === ASIDE_PART ? this.asideDialogsEl : this.dialogsEl);
  }



  /**
   * Returns the id of the active menu
   * NOTE: This is the menu that is shown in the default or full part of the app
   *
   * @returns { String } - The id of the active main menu
   */
  getActiveMenuId() {
    return this.menusEl.querySelector('menu[active]')?.dataset?.id;
  }

  /**
   * Returns the id of the active main menu
   * NOTE: This is the menu that is shown in the `<main>` part of the app
   *
   * @returns { String } - The id of the active main menu
   */
  getActiveMainMenuId() {
    return this.mainMenusEl.querySelector('menu[active]')?.dataset?.id;
  }

  

  /**
   * Returns the id of the active main menu
   * NOTE: This is the menu that is shown in the `<aside>` part of the app
   *
   * @returns { String } - The id of the active aside menu
   */
  getActiveAsideMenuId() {
    return this.asideMenusEl.querySelector('menu[active]')?.dataset?.id;
  }


  /**
   * Returns the current menu element of the given `id` and `part`
   *
   * @param { String } menuId - The id of the menu to get
   * @param { String } part - The part of the app where the menu will be shown (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Element } - The current menu element of the given `id` and `part`
   */
  getMenuById(menuId, part = DEFAULT_PART) {
    return this.getCurrentMenusElement(part).querySelector(`menu[data-id="${menuId}"]`);
  }


  /**
   * Returns the current dialog element of the given `id` and `part`
   *
   * @param { String } dialogId - The id of the dialog to get
   * @param { String } part - The part of the app where the dialogwill be shown (eg. MAIN_PART, ASIDE_PART, FULL_PART)
   *
   * @returns { Element } - The current dialogelement of the given `id` and `part`
   */
  getMenuById(dialogId, part = DEFAULT_PART) {
    return this.getCurrentDialogsElement(part).querySelector(`dialog[data-id="${dialogId}"]`);
  }


  /**
   * Returns the sticky app bar element of the given `appLayoutEl`
   *
   * @returns { Element } stickyAppBarEl
   */
  getStickyAppBarElement(appLayoutEl) {
    return appLayoutEl.querySelector('.app-bar[sticky]');
  }

  /**
   * Returns the main toasts element.
   * NOTE: This is the `<div class="toasts">` element inside the `<main>` element.
   * 
   * @returns { Element } - The main toasts element 
   */
  get mainToastsEl() {
    return document.querySelector('main > .toasts');
  }

  /**
   * Returns the aside toasts element.
   * NOTE: This is the `<div class="toasts">` element inside the `<aside>` element.
   * 
   * @returns { Element } - The aside toasts element 
   */
  get asideToastsEl() {
    return document.querySelector('aside > .toasts');
  }


  /**
   * Returns the default or full toasts element.
   * NOTE: This is the `<div id="toasts">` element inside the `<body>` element.
   * 
   * @returns { Element } - The default toasts element 
   */
  get toastsEl() {
    return document.querySelector('#toasts');
  }


  /**
   * Returns the side bar element.
   * NOTE: This is the `<div id="sideBar">` element inside the `<body>` element.
   *
   * @returns { Element } - The side bar element
   */
  get sideBarEl() {
    return document.getElementById('sideBar');
  }


  /**
   * Returns the nav bar element.
   * NOTE: This is the `<div id="navBar">` element inside the `<body>` element.
   *
   * @returns { Element } - The side bar element
   */
  get navBarEl() {
    return document.getElementById('navBar');
  }


  /**
   * Returns the main element of the app.
   *
   * @returns { Element } 
   */
  get mainEl() {
    return document.querySelector('body > main');
  }
  
  
  /**
   * Returns the aside element of the app.
   * NOTE: This is the `<aside>` element inside the `<body>` element.
   *
   * @returns { Element } - The aside element
   */
  get asideEl() {
    return document.querySelector('body > aside');
  }

  // === Checkers ===

  /**
   * Returns TRUE if the app has a side bar, FALSE otherwise.
   *
   * @returns { Boolean } - Whether the app has a side bar or not
   */
  get hasSideBar() {
    return this.sideBarEl !== null;
  }

  /**
   * Returns TRUE if the app has a nav bar, FALSE otherwise.
   *
   * @returns { Boolean } - Whether the app has a nav bar or not
   */
  get hasNavBar() {
    return this.navBarEl !== null;
  }
  
  /**
   * Returns the main backdrop element.
   * NOTE: This is the `<div class="backdrop">` element inside the `<main>` element.
   *
   * @returns { Element } - The main backdrop element
   */
  get mainBackdropEl() {
    return this.mainEl.querySelector('.backdrop');
  }


  /**
   * Returns the aside backdrop element.
   * NOTE: This is the `<div class="backdrop">` element inside the `<aside>` element.
   *
   * @returns { Element } - The main backdrop element
   */
  get asideBackdropEl() {
    return this.asideEl.querySelector('.backdrop');
  }
  

  /**
   * Returns the default backdrop element.
   * NOTE: This is the `<div id="backdrop">` element inside the `<body>` element.
   *
   * @returns { Element } - The main backdrop element
   */
  get backdropEl() {
    return document.getElementById('backdrop');
  }



  /**
   * Returns the default menus element.
   * NOTE: This is the `<div id="menus">` element inside the `<body>` element.
   * 
   * @returns { Element } - The default menus element
   */
  get menusEl() {
    return document.getElementById('menus');
  }

  /**
   * Returns the main menus element.
   * NOTE: This is the `<div class="menus">` element inside the `<main>` element.
   *
   * @returns { Element } - The main menus element
   * @private
   */
  get mainMenusEl() {
    return this.mainEl.querySelector('.menus');
  }

  /**
   * Returns the aside menus element.
   * NOTE: This is the `<div class="menus">` element inside the `<aside>` element.
   *
   * @returns { Element } - The aside menus element
   * @private
   */
  get asideMenusEl() {
    return this.asideEl.querySelector('.menus');
  }

  /**
   * Returns a list of all the main close menu icon buttons.
   * NOTE: This is the `<button class="icon-button">` element inside the `<li role="close-menu">` of all main menus.
   *
   * @returns { NodeList } - A list of all the main close-menu icon-buttons
   */
  get mainCloseMenuIconButtons() {
    return this.mainMenusEl.querySelectorAll('li[role="close-menu"] > .icon-button');
  }

  /**
   * Returns a list of all the aside close menu icon buttons.
   * NOTE: This is the `<button class="icon-button">` element inside the `<li role="close-menu">` of all aside menus.
   *
   * @returns { NodeList } - A list of all the aside close-menu icon-buttons
   */
  get asideCloseMenuIconButtons() {
    return this.asideMenusEl.querySelectorAll('li[role="close-menu"] > .icon-button');
  }


  /**
   * Returns a list of all the close menu icon buttons.
   * NOTE: This is the `<button class="icon-button">` element inside the `<li role="close-menu">` of all menus.
   *
   * @returns { NodeList } - A list of all the close-menu icon-buttons
   */
  get closeMenuIconButtons() {
    return this.menusEl.querySelectorAll('li[role="close-menu"] > .icon-button');
  }


  /**
   * Returns the main app layout element.
   *
   * @returns { Element } - The main app layout element
   */
  get mainAppLayout() {
    return this.mainEl.querySelector('.app-layout');
  }

  /**
   * Returns the aside app layout element.
   *
   * @returns { Element } - The aside app layout element
   */
  get asideAppLayout() {
    return this.asideEl.querySelector('.app-layout');
  }


  /**
   * Returns a list of all the app layouts.
   * 
   * @returns { NodeList } 
   */
  get appLayoutEls() {
    return document.querySelectorAll('.app-layout');
  }


  /**
   * Returns the default dialogs element.
   *
   * @returns { Element } - The default dialogs element
   */
  get dialogsEl() {
    return document.getElementById('dialogs');
  }

  /**
   * Returns the main dialogs element.
   *
   * @returns { Element } - The main dialogs element
   */
  get mainDialogsEl() {
    return this.mainEl.querySelector('.dialogs');
  }


  /**
   * Returns the aside dialogs element.
   *
   * @returns { Element } - The aside dialogs element
   */
  get asideDialogsEl() {
    return this.asideEl.querySelector('.dialogs');
  }



  

  // PRIVATE METHODS

  /**
   * Clears our toast.
   * This method will remove any `<div class="toast">` element from `currentToastEl`
   *
   * @param { Element } toastsEl - The toasts element
   * @private
   */
  _clearToast(toastsEl) {
    // clear any active `toastTimer` and `toastOutTimer`
    clearTimeout(this._toastTimer);
    clearTimeout(this._toastOutTimer);
    
    // empty `toastsEl`
    toastsEl.innerHTML = '';

    // hide `toastsEl`
    toastsEl.hidden = true;

  }


  /**
   * Method used to fade the toast out.
   *
   * @param { Element } toastEl - The toast element
   * @param { Number } timeout - The timeout (in seconds) after which the toast will be hidden
   *
   * @returns { Promise }
   */
  _fadeToastOut(toastEl, timeout = 0.5) {
    return new Promise((resolve, reject) => {

      // set / create a new `_toastOutTimer`
      this._toastOutTimer = setTimeout(() => {
        // remove the `fade-in` and `pop-in` class from `toastEl`
        toastEl.classList.remove('fade-in', 'pop-in');

        // add the `fade-out` class to `toastEl`
        toastEl.classList.add('fade-out');

        // resolve the promise
        resolve();
      }, timeout * 1000);
    });
  }


  /**
   * Handler that is called when the window is resized to a narrow layout.
   *
   * @param { Boolean } firstNarrowLayout - Whether this is the first time the window is resized to a narrow layout or not
   */
  _handleNarrowLayout(firstNarrowLayout) {
    // Hide the `sideBar` element
    this.hideSideBar();
    // Show the `navBar` element
    this.showNavBar();

    // DEBUG [4dbsmaster]: tell me about it ;)
    console.log(`\x1b[33m[_handleNarrowLayout]: firstNarrowLayout ? ${firstNarrowLayout}\x1b[0m`);
  }


  /**
   * Handler that is called when the window is resized to a wide layout.
   *
   * @param { Boolean } firstWideLayout - Whether this is the first time the window is resized to a wide layout or not
   */
  _handleWideLayout(firstWideLayout) {
    // Show the `sideBar` element
    this.showSideBar();
    // Hide the `navBar` element
    this.hideNavBar();

    // DEBUG [4dbsmaster]: tell me about it ;)
    console.log(`\x1b[34m[_handleWideLayout]: firstWideLayout ? ${firstWideLayout}\x1b[0m`);
  }


  /**
   * Method used to install the necessary event listeners of the app.
   * @private
   */
  _installEventListeners() {
    // installing event listeners for all `backdrop` elements...
    //
    // ...for the `mainBackdropEl`
    this.mainBackdropEl.addEventListener('click', () => {
      // toggle the active main menu
      this.toggleMenuById(this.getActiveMainMenuId(), DEFAULT_BACKDROP_TIMEOUT, MAIN_PART);
    });

    // ...for the `asideBackdropEl`
    this.asideBackdropEl.addEventListener('click', () => {
      // toggle the active aside menu
      this.toggleMenuById(this.getActiveAsideMenuId(), DEFAULT_BACKDROP_TIMEOUT, ASIDE_PART);
    });

    // ...for the default `backdropEl`
    this.backdropEl.addEventListener('click', () => {
      // toggle the active (default) menu
      this.toggleMenuById(this.getActiveMenuId(), DEFAULT_BACKDROP_TIMEOUT, DEFAULT_PART);
    });




    // installing event listeners for all `closeMenu` Icon-Buttons...
    //
    // ...for the `mainCloseMenuIconButtons`
    this.mainCloseMenuIconButtons.forEach(iconButton => {
      iconButton.addEventListener('click', () => {
        // toggle the active main menu
        this.toggleMenuById(this.getActiveMainMenuId(), DEFAULT_MENU_TIMEOUT, MAIN_PART);
      });
    });

    // ...for the `asideCloseMenuIconButtons`
    this.asideCloseMenuIconButtons.forEach(iconButton => {
      iconButton.addEventListener('click', () => {
        // toggle the active aside menu
        this.toggleMenuById(this.getActiveAsideMenuId(), DEFAULT_MENU_TIMEOUT, ASIDE_PART);
      });
    });

    // ...for the default `closeMenuIconButtons`
    this.closeMenuIconButtons.forEach(iconButton => {
      iconButton.addEventListener('click', () => {
        // toggle the active (default) menu
        this.toggleMenuById(this.getActiveMenuId(), DEFAULT_MENU_TIMEOUT, DEFAULT_PART);
      });
    });



    // installing event listeners for each available app layout element as `appLayoutEl`...
    this.appLayoutEls.forEach((appLayoutEl) => {
      appLayoutEl.addEventListener('scroll', (event) => {
        // handle the app layout scroll 
        this._appLayoutScrollHandler(event, appLayoutEl);
      });
    });

  }


  // PRIVATE SETTERS
  // PRIVATE GETTERS
  
  // =========== Dynamic HTML Templates =============== //

  /**
   * Returns the html template of a toast based on the specified `type` and `message`
   *
   * @param { String } type - The type of the toast (eg. ERROR_TOAST, GOOD_TOAST, BAD_TOAST, NORMAL_TOAST)
   * @param { String } message - The message to display
   *
   * @returns { HTMLTemplate }
   */
  _getToastHtmlTemplate(type, message) {
    // get the corrent emoji for the given `type`
    let emoji = (type === ERROR_TOAST) ? '🚫' : (type === GOOD_TOAST) ? '👍' : (type === BAD_TOAST) ? '👎' : '';

    return html`
      <!-- Toast -->
      <div class="toast pop-in fade-in flex-layout horizontal centered">
        <!-- Emoji -->
        <span class="toast-emoji ${type}" ${(type === NORMAL_TOAST) ? 'hidden' : ''}></span>
        <!-- Message -->
        <span class="toast-msg">${emoji}${message}</span>
      </div>
      <!-- End of Toast -->
    `;
  }


  /**
   * Handler that is called whenever an `app-layout` element is scrolling
   * TODO: Make the app bar sticky
   *
   * @param { ScrollEvent } event
   * @param { Element } appLayoutEl
   * @private
   */
  _appLayoutScrollHandler(event, appLayoutEl) {
    // get the current `scrollTop` of `appLayoutEl`
    let scrollTop = appLayoutEl.scrollTop;

    // get the sticky app bar element of the `appLayoutEl` as `stickyAppBarEl`
    let stickyAppBarEl = this.getStickyAppBarElement(appLayoutEl);

    // get the parent header element of `stickyAppBarEl` as `headerEl`
    let headerEl = stickyAppBarEl.parentElement;

    // if theres no [sticky-enabled] property on `headerEl` 
    if (headerEl.hasAttribute('sticky-enabled') === false) {
      // ...then set it
      headerEl.setAttribute('sticky-enabled', '');
    }
    
    // get the top RECT value of `stickyAppBarEl` as `stickyTop`
    //let stickyTop = //stickyAppBarEl.getComputedStyle().top; // stickyAppBarEl.getBoundingClientRect().top;
    let stickyTop = stickyAppBarEl.getBoundingClientRect().top;
    let stickyOffsetTop = stickyAppBarEl.offsetTop;


    headerEl.style.top = (scrollTop > stickyTop) ? `-${stickyOffsetTop}px` : `-${scrollTop}px`;


    // DEBUG [4dbsmaster]: tell me about it ;)
    console.log(`\x1b[35m[_appLayoutScrollHandler] (1): 
      scrollTop => ${scrollTop} & 
      stickyTop => ${stickyTop} &
      stickyOffsetTop => ${stickyOffsetTop}
    \x1b[0m`);
    // console.log(`\x1b[35m[_appLayoutScrollHandler] (2):  event => \x1b[0m`, event);
    // console.log(`\x1b[35m[_appLayoutScrollHandler] (3): appLayoutEl => \x1b[0m`, appLayoutEl);
  }


  /**
   * Returns the html template of the app's dialog
   *
   * @param { Object } data - The data to use for the dialog
   *
   * @param { String } data.title - The title of the dialog
   * @param { String } data.message - The message of the dialog
   * @param { String } data.confirmBtnText - The text of the confirm button
   * @param { String } data.cancelBtnText - The text of the cancel button
   * @param { Boolean } data.noDivider - Whether to hide the divider between the buttons
   * @param { Function } data.onConfirm - The function to call when the confirm button is clicked
   * @param { Function } data.onCancel - The function to call when the cancel button is clicked
   * 
   * @returns { HTMLTemplate }
   */
  _getDialogHTMLTemplate(data) {
    return html`
      <!-- Dialog -->
      <div data-id="dialog" class="dialog slide-from-up" hidden>
        <!-- Dialog Title -->
        <h2 class="dialog-title">${data.title}</h2>
        <!-- Dialog Message -->
        <p class="dialog-msg">${data.message}</p>

        <!-- Dialog Buttons -->
        <div class="dialog-buttons">
          <!-- Confirm Button -->
          <a role="button" 
             onclick="data.onConfirm(this)" 
             tabindex="0" 
             class="dialog-button" 
             default 
             autofocus>
            ${data.confirmBtnText}
          </a>

          <!-- Divider -->
          <span class="divider horizontal left" ${data.noDivider ? return 'hidden' : ''}></span>

          <!-- Cancel Button -->
          <a role="button" 
             onclick="data.onCancel(this)" 
             tabindex="0" 
             class="dialog-button" 
             confirm>
            ${data.cancelBtnText}
          </a>

        </div>
        <!-- End of Dialog Buttons -->

      </div>
      <!-- End of Dialog -->
    `;
  }



}








// use the `lang` attribute of the `<html>` element as the default language
const lang = document.documentElement.lang || 'en'; // <- default to `en` (english) if no `lang` attribute is found

// TODO: use the `theme` value from the `<body>` dataset as the default theme
const theme = 'light'; // <- default to `light`


// Create a global object of the `MaxaboomApp` class as `mbApp`
window.mbApp = new MaxaboomApp(lang, theme);


// When the maxaboom app is ready ...
mbApp.onReady = (data) => {
  // ... set the title of the page to `!`
  let hello = mbApp.i18n.getString('hello') + '👋🏽';

  mbApp.setTitle(hello, true); // <- true = append the app name to the title

}

