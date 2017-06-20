
(function () {
  'use strict';
  var pluginName = 'tabs',
    defaults = {
      heading: '>.heading',
      responsive: true,
      start: 0,
      toggle: function () {},
      init: function () {},
      debug: false
    };

  $[pluginName] = function (element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, defaults, options);
    this.debug = this.options.debug;

    this._defaults = defaults;
    this._name = pluginName;

    $.when($.proxy(this.initialize(), this)).done(typeof this.options.init === 'function' && this.options.init());

  };

  $[pluginName].prototype = {
    initialize: function () {
      if (this.debug) console.log('initialize()', this);

      this.$tabs = this.$element.find('>tab');
      this.tabs = this.processTabs();
      this.$nav = this.createNav();

      this.activateTab(this.options.start);

      this.$element.attr('alive',true);

      if(this.options.responsive) {
        $(window).resize($.proxy(this.onResize,this)).resize();
      }
    },

    processTabs: function (){
      var tabs = {};
      this.count = 0;
      $.each(this.$tabs,$.proxy(function (index,tab){
        var $tab = $(tab);
        $tab.data('heading', $tab.find(this.options.heading));
        $tab.data('index',index);

        tabs[index] = {
          el: $tab,
          title: $tab.data('heading').text(),
          cssClass: typeof $tab.data('heading').attr('class') !== 'undefined' ? $tab.data('heading').attr('class') : ''
        };

        $tab.data('heading').remove();

        this.count++;
      },this));
      return tabs;
    },

    createNav: function (){
      var nav = $('<nav></nav>');

      $.each(this.tabs,$.proxy(function (index,tab){
        nav.append(
          $('<tab />').data('index',index).addClass(tab.cssClass)
            .append($('<span />').text(tab.title).addClass(tab.cssClass))
            .on('click',$.proxy(function (){
              this.activateTab(index);
            },this))
          );
      },this));


      this.$element.prepend(nav);

      if(this.options.responsive) {
        this.navWidth = 0;
        $.each(nav.find('tab'),$.proxy(function (index,tab){
          this.navWidth += $(tab).outerWidth();
        },this));
        this.navWidth += 40;
      }

      return nav;
    },

    activateTab: function (tabNr){
      var tab = typeof tabNr !== 'undefined' && tabNr !== '' ? parseInt(tabNr,10) : 0;
      tab = tab > this.count - 1 ? this.count - 1 : tab;
      tab = tab < 0 ? 0 : tab;

      if (this.debug) console.log('tab nr {' + tabNr + '} should be activated');

      $.each(this.$nav.find('>tab'),function (index){
        if(index === tab) {
          $(this).attr('active',true).siblings('tab').attr('active',false);
        }
      });

      $.each(this.$tabs,function (index){
        if(index === tab) {
          $(this).attr('active',true).siblings('tab').attr('active',false);
        }
      });

      if (typeof this.options.toggle === 'function') {
        this.options.toggle(this.$tabs[tab]);
      }
    },

    onResize: function (){
      clearTimeout(this.timeout);
      this.timeout = setTimeout($.proxy(function (){
        this.$element.attr('break',this.navWidth >= $(window).width());
      },this),200);
    },

    destroy: function (){
      if (this.debug) console.log('destroying tabs',this);

      $.each(this.$tabs,$.proxy(function (index,tab){
        var $tab = $(tab), heading = $tab.data('heading');
        $tab.prepend(heading);
      },this));
      this.$nav.remove();
      this.$element.attr('alive',false);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$(this).data('form5-'+pluginName)) {
        if (options === 'destroy') return;
        $(this).data('form5-'+pluginName, new $[pluginName](this, options));
      } else {
        var $form5Tabs = $(this).data('form5-'+pluginName);
        switch (options) {
          case 'destroy':
            $form5Tabs.destroy();
            $(this).removeData(pluginName);
            break;
          default:
            if (typeof options === 'number') $form5Tabs.activateTab(options);
        }
      }
    });
  };

}).call(this);