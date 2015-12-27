/*
 * Copyright (c) 2014 ThoughtWorks, Inc.
 *
 * Pixelated is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pixelated is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pixelated. If not, see <http://www.gnu.org/licenses/>.
 */
define(
  [
    'flight/lib/component',
    'views/templates',
    'mixins/with_mail_edit_base',
    'page/events',
    'mail_view/data/mail_builder'
  ],

  function (defineComponent, templates, withMailEditBase, events, mailBuilder) {
    'use strict';

    return defineComponent(composeBox, withMailEditBase);

    function composeBox() {

      this.defaultAttrs({
        'closeButton': '.close-mail-button'
      });

      this.showNoMessageSelected = function() {
        this.trigger(events.dispatchers.rightPane.openNoMessageSelected);
      };

      this.buildMail = function(tag) {
        return this.builtMail(tag).build();
      };

      this.builtMail = function(tag) {
        return mailBuilder.newMail(this.attr.ident)
          .subject(this.select('subjectBox').val())
          .to(this.attr.recipientValues.to)
          .cc(this.attr.recipientValues.cc)
          .bcc(this.attr.recipientValues.bcc)
          .body(this.select('bodyBox').val())
          .attachment(this.attr.attachments)
          .tag(tag);
      };

      this.renderComposeBox = function() {
        this.render(templates.compose.box, {});
        this.enableFloatlabel('input.floatlabel');
        this.enableFloatlabel('textarea.floatlabel');
        this.select('recipientsFields').show();
        this.on(this.select('closeButton'), 'click', this.showNoMessageSelected);
        this.enableAutoSave();
      };

      this.mailDeleted = function(event, data) {
        if (_.contains(_.pluck(data.mails, 'ident'),  this.attr.ident)) {
          this.trigger(events.dispatchers.rightPane.openNoMessageSelected);
        }
      };

      this.discardDraft = function () {
        this.trigger(events.dispatchers.rightPane.openNoMessageSelected);
      };

      this.toggleRecipientsArrows = function () {
        if ($('#cc-bcc-collapse').hasClass('fa-angle-down')) {
          $('#cc-bcc-collapse').removeClass('fa-angle-down');
          $('#cc-bcc-collapse').addClass('fa-angle-up');
        } else {
          $('#cc-bcc-collapse').removeClass('fa-angle-up');
          $('#cc-bcc-collapse').addClass('fa-angle-down');
        }
      };


      this.after('initialize', function () {
        this.renderComposeBox();

        this.select('toBox').focus();
        this.on(document, events.mail.deleted, this.mailDeleted);
        this.on(document, events.mail.sent, this.showNoMessageSelected);
        this.on($('#cc-bcc-collapse'), 'click', this.toggleRecipientsArrows);
      });
    }
  }
);
