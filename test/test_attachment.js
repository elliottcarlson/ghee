import chai from 'chai';
import { Attachments, Attachment, Field } from '../src/attachment.js';

chai.should();

describe('Attachments', () => {
  describe('#constructor()', () => {
    let attachments = new Attachments();

    it('returns a new instance', () => {
      attachments.should.be.instanceof(Attachments);
    });

    it('should have an attachments property', () => {
      attachments.should.have.property('attachments');
    });

    it('should have a hasAttachments property', () => {
      attachments.should.have.property('hasAttachments', true);
    });

    it('should have a text property', () => {
      attachments.should.have.property('text');
    });

    it('should be able to set the text property', () => {
      attachments.text = 'test text';

      attachments.text.should.equal('test text');
    });
  });

  describe('#add()', () => {
    let attachments = new Attachments();

    it('should add return a new Attachment', () => {
      let attachment = attachments.add();

      attachment.should.be.instanceof(Attachment);
    });

    it('should add an attachment to the attachments array', () => {
      let attachment = attachments.add();

      attachment.text = 'Test Attachment';

      attachments.should.have.deep.property('attachments[1].text', 'Test Attachment');
    });
  });

  describe('#toString()', () => {
    let attachments = new Attachments();

    it('should return attachments property as string', () => {
      attachments.toString().should.equal(`[]`);
    });
  });
});

describe('Attachment', () => {
  describe('#constructor()', () => {
    let attachment = new Attachment();

    it('returns a new instance', () => {
      attachment.should.be.instanceof(Attachment);
    });

    it('should have an attachment property', () => {
      attachment.should.have.property('attachment');
    });

    it('should predefine markdown rules', () => {

      attachment.attachment.should.have.property('mrkdwn_in').and.members(
        [ 'pretext', 'text', 'fields' ]
      );
    });
  });

  describe('#toString()', () => {
    let attachment = new Attachment();

    it('should show default string representation of attachment', () => {
      attachment.toString().should.equal(`{
        "mrkdwn_in": [
          "pretext",
          "text",
          "fields"
        ]
      }`.replace(/^[ ]{6}/gm, ''));
    });

    it('should still show string representation of attachment', () => {
      attachment.fallback = 'test fallback';

      attachment.toString().should.equal(`{
        "mrkdwn_in": [
          "pretext",
          "text",
          "fields"
        ],
        "fallback": "test fallback"
      }`.replace(/^[ ]{6}/gm, ''));
    });
  });

  describe('#fallback', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let fallback = attachment.fallback;

      chai.expect(fallback).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.fallback = 'test fallback';

      attachment.fallback.should.equal('test fallback');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.fallback = undefined;

      attachment.fallback.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.fallback = 'modified';
      }

      fn.should.change(attachment.attachment, 'fallback');
    });
  });

  describe('#color', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let color = attachment.color;

      chai.expect(color).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.color = '#FF0000';

      attachment.color.should.equal('#FF0000');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.color = undefined;

      attachment.color.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.color = '#0000FF';
      }

      fn.should.change(attachment.attachment, 'color');
    });
  });

  describe('#pretext', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let pretext = attachment.pretext;

      chai.expect(pretext).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.pretext = 'test pretext';

      attachment.pretext.should.equal('test pretext');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.pretext = undefined;

      attachment.pretext.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.pretext = 'modified';
      }

      fn.should.change(attachment.attachment, 'pretext');
    });
  });

  describe('#author_name', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let author_name = attachment.author_name;

      chai.expect(author_name).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.author_name = 'test author_name';

      attachment.author_name.should.equal('test author_name');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.author_name = undefined;

      attachment.author_name.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.author_name = 'modified';
      }

      fn.should.change(attachment.attachment, 'author_name');
    });
  });

  describe('#author_link', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let author_link = attachment.author_link;

      chai.expect(author_link).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.author_link = 'test author_link';

      attachment.author_link.should.equal('test author_link');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.author_link = undefined;

      attachment.author_link.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.author_link = 'modified';
      }

      fn.should.change(attachment.attachment, 'author_link');
    });
  });

  describe('#author_icon', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let author_icon = attachment.author_icon;

      chai.expect(author_icon).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.author_icon = 'test author_icon';

      attachment.author_icon.should.equal('test author_icon');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.author_icon = undefined;

      attachment.author_icon.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.author_icon = 'modified';
      }

      fn.should.change(attachment.attachment, 'author_icon');
    });
  });

  describe('#title', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let title = attachment.title;

      chai.expect(title).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.title = 'test title';

      attachment.title.should.equal('test title');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.title = undefined;

      attachment.title.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.title = 'modified';
      }

      fn.should.change(attachment.attachment, 'title');
    });
  });

  describe('#title_link', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let title_link = attachment.title_link;

      chai.expect(title_link).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.title_link = 'test title_link';

      attachment.title_link.should.equal('test title_link');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.title_link = undefined;

      attachment.title_link.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.title_link = 'modified';
      }

      fn.should.change(attachment.attachment, 'title_link');
    });
  });

  describe('#text', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let text = attachment.text;

      chai.expect(text).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.text = 'test text';

      attachment.text.should.equal('test text');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.text = undefined;

      attachment.text.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.text = 'modified';
      }

      fn.should.change(attachment.attachment, 'text');
    });
  });

  describe('#image_url', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let image_url = attachment.image_url;

      chai.expect(image_url).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.image_url = 'test image_url';

      attachment.image_url.should.equal('test image_url');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.image_url = undefined;

      attachment.image_url.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.image_url = 'modified';
      }

      fn.should.change(attachment.attachment, 'image_url');
    });
  });

  describe('#thumb_url', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let thumb_url = attachment.thumb_url;

      chai.expect(thumb_url).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.thumb_url = 'test thumb_url';

      attachment.thumb_url.should.equal('test thumb_url');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.thumb_url = undefined;

      attachment.thumb_url.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.thumb_url = 'modified';
      }

      fn.should.change(attachment.attachment, 'thumb_url');
    });
  });

  describe('#footer', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let footer = attachment.footer;

      chai.expect(footer).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.footer = 'test footer';

      attachment.footer.should.equal('test footer');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.footer = undefined;

      attachment.footer.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.footer = 'modified';
      }

      fn.should.change(attachment.attachment, 'footer');
    });
  });

  describe('#footer_icon', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let footer_icon = attachment.footer_icon;

      chai.expect(footer_icon).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.footer_icon = 'test footer_icon';

      attachment.footer_icon.should.equal('test footer_icon');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.footer_icon = undefined;

      attachment.footer_icon.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.footer_icon = 'modified';
      }

      fn.should.change(attachment.attachment, 'footer_icon');
    });
  });

  describe('#timestamp', () => {
    let attachment = new Attachment();

    it('is undefined by default', () => {
      let timestamp = attachment.timestamp;

      chai.expect(timestamp).to.be.undefined;
    });

    it('can be changed', () => {
      attachment.timestamp = 'test timestamp';

      attachment.timestamp.should.equal('test timestamp');
    });

    it('doesn\'t do anything when changed to undefined', () => {
      attachment.timestamp = undefined;

      attachment.timestamp.should.not.be.undefined;  
    });

    it('modifies the attachment property', () => {
      var fn = function() {
        attachment.timestamp = 'modified';
      }

      fn.should.change(attachment.attachment, 'ts');
    });
  });

  describe('#add_field()', () => {
    let attachment = new Attachment();

    it('does not have a fields to start', () => {
      attachment.attachment.should.not.have.property('fields');
    });

    it('can have a field added', () => {
      let field = attachment.add_field();

      field.should.be.instanceof(Field);
    });

    it('now has a fields property', () => {
      attachment.attachment.should.have.property('fields');
    });

    it('can have multiple fields', () => {
      let field = attachment.add_field();

      attachment.attachment.fields.should.have.lengthOf(2);
    });
  });
});

describe('Field', () => {
  describe('#constructor()', () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it('returns a new instance', () => {
      field.should.be.instanceof(Field);
    });

    it('should have a title property', () => {
      field.should.have.property('title', '');
    });

    it('should have a value property', () => {
      field.should.have.property('value', '');
    });

    it('should have a short property', () => {
      field.should.have.property('short', true);
    });
  });

  describe('#title', () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it('is empty by default', () => {
      field.title.should.equal('');
    });

    it('can be changed', () => {
      field.title = 'test title';
      field.title.should.equal('test title');
    });
  });

  describe('#value', () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it('is empty by default', () => {
      field.value.should.equal('');
    });

    it('can be changed', () => {
      field.value = 'test value';
      field.value.should.equal('test value');
    });
  });

  describe('#short', () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it('is true by default', () => {
      field.short.should.be.true;
    });

    it('can be changed', () => {
      field.short = false;
      field.short.should.be.false;
    });
  });
});
