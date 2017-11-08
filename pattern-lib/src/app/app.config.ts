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
          title: 'UI',
          uri: 'components/ui'
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
        'site-navigation'
      ]
    }, {
      uriKey: 'lists',
      heading: 'Lists',
      description: 'TODO',
      list: []
    }, {
      uriKey: 'callouts',
      heading: 'Call-outs',
      description: 'TODO',
      list: []
    }, {
      uriKey: 'ui',
      heading: 'UI',
      description: 'TODO',
      list: []
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
    }
  ]
};
