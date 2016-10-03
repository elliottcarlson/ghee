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

export class Attachment {
  constructor() {
    this.attachment = {
      'mrkdwn_in': [ 'pretext', 'text', 'fields' ]
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

  set author_name(value) {
    if (value) {
      this.attachment.author_name = value;
    }
  }

  get author_name() {
    return this.attachment.author_name;
  }

  set author_link(value) {
    if (value) {
      this.attachment.author_link = value;
    }
  }

  get author_link() {
    return this.attachment.author_link;
  }

  set author_icon(value) {
    if (value) {
      this.attachment.author_icon = value;
    }
  }

  get author_icon() {
    return this.attachment.author_icon;
  }

  set title(value) {
    if (value) {
      this.attachment.title = value;
    }
  }

  get title() {
    return this.attachment.title;
  }

  set title_link(value) {
    if (value) {
      this.attachment.title_link = value;
    }
  }

  get title_link() {
    return this.attachment.title_link;
  }

  set text(value) {
    if (value) {
      this.attachment.text = value;
    }
  }

  get text() {
    return this.attachment.text;
  }

  set image_url(value) {
    if (value) {
      this.attachment.image_url = value;
    }
  }

  get image_url() {
    return this.attachment.image_url;
  }

  set thumb_url(value) {
    if (value) {
      this.attachment.thumb_url = value;
    }
  }

  get thumb_url() {
    return this.attachment.thumb_url;
  }

  set footer(value) {
    if (value) {
      this.attachment.footer = value;
    }
  }

  get footer() {
    return this.attachment.footer;
  }

  set footer_icon(value) {
    if (value) {
      this.attachment.footer_icon = value;
    }
  }

  get footer_icon() {
    return this.attachment.footer_icon;
  }

  set timestamp(value) {
    if (value) {
      this.attachment.ts = value;
    }
  }

  get timestamp() {
    return this.attachment.ts;
  }

  add_field() {
    if (!('fields' in this.attachment)) {
      this.attachment.fields = [];
    }

    let field = new Field();
    this.attachment.fields.push(field);
    return field;
  }
}

export class Field {
  constructor() {
    this.title = '';
    this.value = '';
    this.short = true;
  }
}
