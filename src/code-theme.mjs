export const nestCodeTheme = {
  name: 'nest-code',
  type: 'dark',
  colors: {
    'editor.background': '#151112',
    'editor.foreground': '#f7f7f7',
    'editor.selectionBackground': '#ea284559',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7a8186' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'entity.name.tag', 'support.type.primitive'],
      settings: { foreground: '#93d7f1' },
    },
    {
      scope: ['string', 'constant.numeric', 'constant.language', 'constant.other', 'support.constant', 'meta.object-literal.key', 'variable.other.property'],
      settings: { foreground: '#ffc093' },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call', 'keyword.operator', 'variable.other.readwrite', 'meta.decorator', 'punctuation.decorator'],
      settings: { foreground: '#ffda98' },
    },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type'], settings: { foreground: '#f7f7f7' } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: '#f7f7f7' } },
  ],
};
