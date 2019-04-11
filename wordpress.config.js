module.exports = {
  theme: {
    slug: 'sample-theme',
    local: true
  },
  plugins: [
    'wordpress-importer',
    'wordpress-seo',
    {
      slug: 'sample-plugin',
      local: true
    }
  ],
  config: {
    WP_DEBUG: true,
    IMPORT_DEBUG: true,
    EMPTY_TRASH_DAYS: 0,
    AUTOMATIC_UPDATER_DISABLED: false,
    WP_AUTO_UPDATE_CORE: false
  },
  option: {
    blogname: 'Sample website',
    blogdescription: 'Another sample website powered by WordPress',
    uploads_user_yearmonth_folders: 0,
    permalink_structure: '/%postname%/'
  }
};
