/* global ComponentUtils */

/**
 * The GaiaPinCard component is a helper to include
 * pinned pages on any view inside gaia
 */
window.GaiaPinCard = (function(win) {
  'use strict';

  // Extend from the HTMLElement prototype
  var proto = Object.create(HTMLElement.prototype);

  var DEFAULT_COLOR = [77, 77, 77];

  // Allow baseurl to be overridden (used for demo page)
  var baseurl = window.GaiaPinCardBaseurl ||
    '../shared/elements/gaia_pin_card/';

  proto.createdCallback = function(test) {
    var shadow = this.createShadowRoot();

    this._template = template.content.cloneNode(true);
    this.container = this._template.querySelector('.pin-card');
    this.bgElement = this._template.querySelector('.background');
    this.descElement = this._template.querySelector('.description');
    this.titleElement = this._template.querySelector('header');
    this.iconElement = this._template.querySelector('i');
    this._background = {};

    shadow.appendChild(this._template);

    ComponentUtils.style.call(this, baseurl);
  };

  Object.defineProperty(proto, 'background', {
    get: function() {
      return this._background;
    },
    set: function(background) {
      var bgSrc = background.src ? 'url(' + background.src + ')' : '';
      this._background = background;
      this.bgElement.style.backgroundImage = bgSrc;
      this.bgElement.style.backgroundColor = background.themeColor || '#4d4d4d';
      var opacity = background.themeColor ? '0.30' : '0.15';
      var computedStyle = window.getComputedStyle(this.bgElement);
      var colorCodes;

      try {
        colorCodes = getColorCodes(computedStyle.backgroundColor);
      } catch (error) {
        colorCodes = DEFAULT_COLOR;
        opacity = 0.15;
      }

      // Adding opacity to the background color
      var rgbaColor = colorCodes.slice(1).join(',') + ', ' + opacity;
      var bgColorRgba = 'rgba(' + rgbaColor + ')';
      var computedWidth = computedStyle.width;
      var width = computedWidth === 'auto' ? '140px' : computedWidth;
      var shadow = 'inset 0 0 0 ' + width;
      this.bgElement.style.boxShadow = shadow + ' ' + bgColorRgba;
    }
  });

  Object.defineProperty(proto, 'meta', {
    get: function() {
      return this._meta;
    },
    set: function(meta) {
      this._meta = meta;
      this.renderCard();
    }
  });

  Object.defineProperty(proto, 'title', {
    get: function() {
      return this.titleElement.textContent;
    },
    set: function(title) {
      this.titleElement.textContent = title;
    }
  });

  Object.defineProperty(proto, 'icon', {
    get: function() {
      return this.iconElement.style.backgroundImage;
    },
    set: function(icon) {
      this.iconElement.style.backgroundImage = icon;
    }
  });

  proto.renderCard = function() {
    var description = getDescription(this._meta);
    if (description) {
      this.descElement.appendChild(description);
      this.container.classList.remove('no-content');
    }

    var background = getBackgroundBlob(this._meta);
    if (background) {
      this.background = {
        src: URL.createObjectURL(background),
        themeColor: this._meta['theme-color'] || null
      };
    }
  };

  var template = document.createElement('template');
  template.innerHTML =
    `<article class="pin-card no-content">
      <div class="icon-container">
        <i></i>
      </div>
      <div class="background"></div>
      <div class="content">
        <header></header>
        <section class="description"></section>
      </div>
    </article>`;

  function getColorCodes(color) {
    var colorCodes = /rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    return colorCodes;
  }

  function getDescription(meta) {
    if (!meta['og:description']) {
      return false;
    }

    var desc = document.createElement('p');
    desc.textContent = meta['og:description'];
    return desc;
  }

  function getBackgroundBlob(meta) {
    return meta['og:image'] || meta.screenshot;
  }

  // Register and return the constructor
  return document.registerElement('gaia-pin-card', { prototype: proto });
})(window);
