export default function({ app, $vuetify })
{
    app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
      
        $vuetify.rtl = newLocale === "il";
    }
}