import { extendTheme } from '@chakra-ui/react';

// New York Times inspired theme
const theme = extendTheme({
  fonts: {
    heading: '"Libre Baskerville", "Georgia", "Times New Roman", serif',
    body: '"Georgia", "Times New Roman", serif',
  },
  colors: {
    nyt: {
      black: '#121212',
      darkGray: '#333333',
      mediumGray: '#666666',
      lightGray: '#CCCCCC',
      veryLightGray: '#F7F7F7',
      border: '#E5E5E5',
      accent: '#326891', // NYT blue for links
    },
  },
  styles: {
    global: {
      body: {
        bg: '#FFFFFF',
        color: '#121212',
        fontSize: '18px',
        lineHeight: '1.75',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontSize: '13px',
      },
      variants: {
        solid: {
          bg: 'nyt.black',
          color: 'white',
          _hover: {
            bg: 'nyt.darkGray',
          },
        },
        outline: {
          borderColor: 'nyt.black',
          color: 'nyt.black',
          borderWidth: '2px',
          _hover: {
            bg: 'nyt.black',
            color: 'white',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'nyt.border',
            borderWidth: '1px',
            _focus: {
              borderColor: 'nyt.black',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderColor: 'nyt.border',
            borderWidth: '1px',
            _focus: {
              borderColor: 'nyt.black',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        fontFamily: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontSize: '10px',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '700',
      },
    },
  },
});

export default theme;
