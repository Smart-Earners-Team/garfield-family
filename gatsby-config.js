module.exports = {
  siteMetadata: {
    name: "Garfield Family",
    siteUrl: "https://garfield.com",
    title: "Garfield Family",
    description: `Garfield Family creates a digital cat pet world where players can raise
      and breed varieties of cute cats and fight shoulder to shoulder in the
      adventure world with your cats`,
    socials: [{ name: "telegramGroup", url: "https://t.me/GarfieldFamily" }],
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: require.resolve("./src/components/AppWrapper.tsx"),
      },
    },
  ],
};
