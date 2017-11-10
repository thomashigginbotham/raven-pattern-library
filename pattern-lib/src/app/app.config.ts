// RPL Configuration

export const rplConfig = {
  title: 'Raven Pattern Library',
  logoUri: '/assets/rpl-logo.svg',
  navigation: [
    {
      title: 'Introduction',
      uri: 'introduction'
    }, {
      title: 'Base Styles',
      uri: 'styles',
      children: [
        {
          title: 'Typography',
          uri: 'styles/typography'
        }, {
          title: 'Color',
          uri: 'styles/color'
        }, {
          title: 'Buttons',
          uri: 'styles/buttons'
        }, {
          title: 'Forms',
          uri: 'styles/forms'
        }, {
          title: 'Tables',
          uri: 'styles/tables'
        }
      ]
    }, {
      title: 'Components',
      uri: 'components',
      children: [
        {
          title: 'Page Structure',
          uri: 'components/page-structure'
        }, {
          title: 'Lists',
          uri: 'components/lists'
        }, {
          title: 'Call-outs',
          uri: 'components/callouts'
        }, {
          title: 'Images',
          uri: 'components/images'
        }
      ]
    }, {
      title: 'Pages',
      uri: 'pages',
      children: [
        {
          title: 'Home',
          uri: 'pages/home'
        }, {
          title: 'Interior',
          uri: 'pages/interior'
        }, {
          title: 'Form',
          uri: 'pages/form'
        }
      ]
    }
  ],
  components: [
    {
      uriKey: 'page-structure',
      heading: 'Page Structure',
      description: 'Common page sections that provide branding, navigation, or important information',
      list: [
        'site-header',
        '/variants/site-navigation-about',
        'site-footer'
      ]
    }, {
      uriKey: 'lists',
      heading: 'Lists',
      description: 'Components that display listings of content.',
      list: [
        'link-list'
      ]
    }, {
      uriKey: 'callouts',
      heading: 'Call-outs',
      description: 'Call-outs are small blocks of content or imagery that draw user’s attention.',
      list: [
        'callout-link-list'
      ]
    }, {
      uriKey: 'images',
      heading: 'Images',
      description: 'Components with a primary focus on imagery.',
      list: [
        'thumbnail-grid'
      ]
    }
  ],
  pages: [
    {
      uriKey: 'home',
      heading: 'Home',
      description: 'The home page of the website.',
      uri: '/index.html'
    }, {
      uriKey: 'interior',
      heading: 'Interior',
      description: 'A generic interior page.',
      uri: '/interior.html'
    }, {
      uriKey: 'form',
      heading: 'Form',
      description: 'A page with a form.',
      uri: '/form.html'
    }
  ]
};
