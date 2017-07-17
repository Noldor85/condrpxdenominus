var ln = 
{
    language:
    {
        //Default values
        code: 'es',
        local: 'Spanish',
        international: 'Spanish'
    },
    
    init: function()
	{
        i18n.init
        ({
            lng: navigator.language,
            useCookie: false,
            fallbackLng: 'es',
            resGetPath: 'language/__lng__/__lng__.json'
        }, function()
        {
            $('body').i18n();
            
            ln.getLanguage();

            $("[i18Trans]").each(function(){
                if( $(this).hasAttr("i18Target")){
                    $(this).attr($(this).attr("i18Target"),$.t($(this).attr("i18Trans")));
                }else{
                    $(this).html($.t($(this).attr("i18Trans")));
                }
            });
        });
    },
    
    getLanguage: function()
    {
        var mylang = navigator.language ? navigator.language : ln.language.code
        i18n.setLng(mylang, function(t)
        {
            $('body').i18n();
        });
    }
};

ln.init();