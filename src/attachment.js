export class Attachment {
  constructor() {
    this.attachment = {
      "mrkdwn_in": [ "pretext", "text", "fields" ]
    };
  }

  toString() {
    return JSON.stringify(this.attachment, null, 2);
  }

  set fallback(value) {
    if (value) {
      this.attachment.fallback = value;
    }
  }

  get fallback() {
    return this.attachment.fallback;
  }

  set color(value) {
    if (value) {
      this.attachment.color = value;
    }
  }

  get color() {
    return this.attachment.color;
  }

  set pretext(value) {
    if (value) {
      this.attachment.pretext = value;
    }
  }

  get pretext() {
    return this.attachment.pretext;
  }

  set authorName(value) {
    if (value) {
      this.attachment.authorName = value;
    }
  }

  get authorName() {
    return this.attachment.authorName;
  }

  set authorLink(value) {
    if (value) {
      this.attachment.authorLink = value;
    }
  }

  get authorLink() {
    return this.attachment.authorLink;
  }

  set authorIcon(value) {
    if (value) {
      this.attachment.authorIcon = value;
    }
  }

  get authorIcon() {
    return this.attachment.authorIcon;
  }

  set title(value) {
    if (value) {
      this.attachment.title = value;
    }
  }

  get title() {
    return this.attachment.title;
  }

  set titleLink(value) {
    if (value) {
      this.attachment.titleLink = value;
    }
  }

  get titleLink() {
    return this.attachment.titleLink;
  }

  set text(value) {
    if (value) {
      this.attachment.text = value;
    }
  }

  get text() {
    return this.attachment.text;
  }

  set imageURL(value) {
    if (value) {
      this.attachment.imageURL = value;
    }
  }

  get imageURL() {
    return this.attachment.imageURL;
  }

  set thumbURL(value) {
    if (value) {
      this.attachment.thumbURL = value;
    }
  }

  get thumbURL() {
    return this.attachment.thumbURL;
  }

  set footer(value) {
    if (value) {
      this.attachment.footer = value;
    }
  }

  get footer() {
    return this.attachment.footer;
  }

  set footerIcon(value) {
    if (value) {
      this.attachment.footerIcon = value;
    }
  }

  get footerIcon() {
    return this.attachment.footerIcon;
  }

  set timestamp(value) {
    if (value) {
      this.attachment.ts = value;
    }
  }

  get timestamp() {
    return this.attachment.ts;
  }

  addField() {
    if (!("fields" in this.attachment)) {
      this.attachment.fields = [];
    }

    let field = new Field();
    this.attachment.fields.push(field);
    return field;
  }
}

export class Attachments {
  constructor() {
    this.attachments = []
    this.hasAttachments = true;
    this.text = null;
  }

  add() {
    let attachment = new Attachment();
    this.attachments.push(attachment.attachment);

    return attachment;
  }

  toString() {
    return JSON.stringify(this.attachments, null, 2);
  }
}

export class Field {
  constructor() {
    this.title = "";
    this.value = "";
    this.short = true;
  }
}
