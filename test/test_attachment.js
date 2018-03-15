import chai from "chai";
import { Attachments, Attachment, Field } from "../src/attachment.js";

chai.should();

describe("Attachments", () => {
  describe("#constructor()", () => {
    let attachments = new Attachments();

    it("returns a new instance", () => {
      attachments.should.be.instanceof(Attachments);
    });

    it("should have an attachments property", () => {
      attachments.should.have.property("attachments");
    });

    it("should have a hasAttachments property", () => {
      attachments.should.have.property("hasAttachments", true);
    });

    it("should have a text property", () => {
      attachments.should.have.property("text");
    });

    it("should be able to set the text property", () => {
      attachments.text = "test text";

      attachments.text.should.equal("test text");
    });
  });

  describe("#add()", () => {
    let attachments = new Attachments();

    it("should add return a new Attachment", () => {
      let attachment = attachments.add();

      attachment.should.be.instanceof(Attachment);
    });

    it("should add an attachment to the attachments array", () => {
      let attachment = attachments.add();

      attachment.text = "Test Attachment";

      attachments.should.have.deep.property("attachments[1].text", "Test Attachment");
    });
  });

  describe("#toString()", () => {
    let attachments = new Attachments();

    it("should return attachments property as string", () => {
      attachments.toString().should.equal("[]");
    });
  });
});

describe("Attachment", () => {
  describe("#constructor()", () => {
    let attachment = new Attachment();

    it("returns a new instance", () => {
      attachment.should.be.instanceof(Attachment);
    });

    it("should have an attachment property", () => {
      attachment.should.have.property("attachment");
    });

    it("should predefine markdown rules", () => {

      attachment.attachment.should.have.property("mrkdwn_in").and.members(
        [ "pretext", "text", "fields" ]
      );
    });
  });

  describe("#toString()", () => {
    let attachment = new Attachment();

    it("should show default string representation of attachment", () => {
      attachment.toString().should.equal(`{
        "mrkdwn_in": [
          "pretext",
          "text",
          "fields"
        ]
      }`.replace(/^[ ]{6}/gm, ""));
    });

    it("should still show string representation of attachment", () => {
      attachment.fallback = "test fallback";

      attachment.toString().should.equal(`{
        "mrkdwn_in": [
          "pretext",
          "text",
          "fields"
        ],
        "fallback": "test fallback"
      }`.replace(/^[ ]{6}/gm, ""));
    });
  });

  describe("#fallback", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let fallback = attachment.fallback;

      chai.expect(fallback).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.fallback = "test fallback";

      attachment.fallback.should.equal("test fallback");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.fallback;

      attachment.fallback.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.fallback = "modified";
      };

      fn.should.change(attachment.attachment, "fallback");
    });
  });

  describe("#color", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let color = attachment.color;

      chai.expect(color).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.color = "#FF0000";

      attachment.color.should.equal("#FF0000");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.color;

      attachment.color.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.color = "#0000FF";
      };

      fn.should.change(attachment.attachment, "color");
    });
  });

  describe("#pretext", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let pretext = attachment.pretext;

      chai.expect(pretext).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.pretext = "test pretext";

      attachment.pretext.should.equal("test pretext");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.pretext;

      attachment.pretext.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.pretext = "modified";
      };

      fn.should.change(attachment.attachment, "pretext");
    });
  });

  describe("#authorName", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let authorName = attachment.authorName;

      chai.expect(authorName).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.authorName = "test authorName";

      attachment.authorName.should.equal("test authorName");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.authorName;

      attachment.authorName.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.authorName = "modified";
      };

      fn.should.change(attachment.attachment, "authorName");
    });
  });

  describe("#authorLink", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let authorLink = attachment.authorLink;

      chai.expect(authorLink).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.authorLink = "test authorLink";

      attachment.authorLink.should.equal("test authorLink");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.authorLink;

      attachment.authorLink.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.authorLink = "modified";
      };

      fn.should.change(attachment.attachment, "authorLink");
    });
  });

  describe("#authorIcon", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let authorIcon = attachment.authorIcon;

      chai.expect(authorIcon).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.authorIcon = "test authorIcon";

      attachment.authorIcon.should.equal("test authorIcon");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.authorIcon;

      attachment.authorIcon.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.authorIcon = "modified";
      };

      fn.should.change(attachment.attachment, "authorIcon");
    });
  });

  describe("#title", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let title = attachment.title;

      chai.expect(title).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.title = "test title";

      attachment.title.should.equal("test title");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.title;

      attachment.title.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.title = "modified";
      };

      fn.should.change(attachment.attachment, "title");
    });
  });

  describe("#titleLink", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let titleLink = attachment.titleLink;

      chai.expect(titleLink).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.titleLink = "test titleLink";

      attachment.titleLink.should.equal("test titleLink");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.titleLink;

      attachment.titleLink.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.titleLink = "modified";
      };

      fn.should.change(attachment.attachment, "titleLink");
    });
  });

  describe("#text", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let text = attachment.text;

      chai.expect(text).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.text = "test text";

      attachment.text.should.equal("test text");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.text;

      attachment.text.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.text = "modified";
      };

      fn.should.change(attachment.attachment, "text");
    });
  });

  describe("#imageURL", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let imageURL = attachment.imageURL;

      chai.expect(imageURL).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.imageURL = "test imageURL";

      attachment.imageURL.should.equal("test imageURL");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.imageURL;

      attachment.imageURL.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.imageURL = "modified";
      };

      fn.should.change(attachment.attachment, "imageURL");
    });
  });

  describe("#thumbURL", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let thumbURL = attachment.thumbURL;

      chai.expect(thumbURL).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.thumbURL = "test thumbURL";

      attachment.thumbURL.should.equal("test thumbURL");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.thumbURL;

      attachment.thumbURL.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.thumbURL = "modified";
      };

      fn.should.change(attachment.attachment, "thumbURL");
    });
  });

  describe("#footer", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let footer = attachment.footer;

      chai.expect(footer).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.footer = "test footer";

      attachment.footer.should.equal("test footer");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.footer;

      attachment.footer.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.footer = "modified";
      };

      fn.should.change(attachment.attachment, "footer");
    });
  });

  describe("#footerIcon", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let footerIcon = attachment.footerIcon;

      chai.expect(footerIcon).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.footerIcon = "test footerIcon";

      attachment.footerIcon.should.equal("test footerIcon");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.footerIcon;

      attachment.footerIcon.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.footerIcon = "modified";
      };

      fn.should.change(attachment.attachment, "footerIcon");
    });
  });

  describe("#timestamp", () => {
    let attachment = new Attachment();

    it("is undefined by default", () => {
      let timestamp = attachment.timestamp;

      chai.expect(timestamp).to.be.undefined;
    });

    it("can be changed", () => {
      attachment.timestamp = "test timestamp";

      attachment.timestamp.should.equal("test timestamp");
    });

    it("doesn't do anything when changed to undefined", () => {
      delete attachment.timestamp;

      attachment.timestamp.should.not.be.undefined;
    });

    it("modifies the attachment property", () => {
      let fn = function() {
        attachment.timestamp = "modified";
      };

      fn.should.change(attachment.attachment, "ts");
    });
  });

  describe("#addField()", () => {
    let attachment = new Attachment();

    it("does not have a fields to start", () => {
      attachment.attachment.should.not.have.property("fields");
    });

    it("can have a field added", () => {
      let field = attachment.addField();

      field.should.be.instanceof(Field);
    });

    it("now has a fields property", () => {
      attachment.attachment.should.have.property("fields");
    });

    it("can have multiple fields", () => {
      attachment.addField();

      attachment.attachment.fields.should.have.lengthOf(2);
    });
  });
});

describe("Field", () => {
  describe("#constructor()", () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it("returns a new instance", () => {
      field.should.be.instanceof(Field);
    });

    it("should have a title property", () => {
      field.should.have.property("title", "");
    });

    it("should have a value property", () => {
      field.should.have.property("value", "");
    });

    it("should have a short property", () => {
      field.should.have.property("short", true);
    });
  });

  describe("#title", () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it("is empty by default", () => {
      field.title.should.equal("");
    });

    it("can be changed", () => {
      field.title = "test title";
      field.title.should.equal("test title");
    });
  });

  describe("#value", () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it("is empty by default", () => {
      field.value.should.equal("");
    });

    it("can be changed", () => {
      field.value = "test value";
      field.value.should.equal("test value");
    });
  });

  describe("#short", () => {
    let field;

    beforeEach(() => {
      field = new Field();
    });

    it("is true by default", () => {
      field.short.should.be.true;
    });

    it("can be changed", () => {
      field.short = false;
      field.short.should.be.false;
    });
  });
});
