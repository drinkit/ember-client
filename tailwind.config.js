module.exports = {
  content: [
    // add extra paths here for components/controllers which include tailwind classes
    './app/index.html',
    './app/templates/**/*.hbs'
  ],
  theme: {
    extend: {
      colors: {
        brick_red: '#E85F1B',
        orange_beach: '#FFB000',
        violet: '#464077',
        light_green: '#00AC8D',
        google_red: '#D83E31',
        vk_blue: '#6281A6',
        fb_blue: '#47619C',
        greengray: '#BBD2C7',
        orange: {
          transparent: 'rgba(255, 174, 0, 0.1)',
        },
        gray: {
          transparent: 'rgba(128,128,128,.77)',
        }
      },
      fontFamily: {
        gothic: ['Century Gothic'],
        georgia: ['Georgia']
      },
      boxShadow: {
        recipe: '1px 2px 8px 1px #999999',
      }
    },
  },
  plugins: [],
}
