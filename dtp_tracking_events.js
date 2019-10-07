/**
 * @file
 * Provides the DTP FlowPlayer Drupal behavior. 
 * The behaviors will be executed on every request including AJAX requests.
 */
(function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 0;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

//function for convert seconds to h:m:s 
function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" : "0:") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s); 
}
    
(function ($) {
    Drupal.behaviors.dtp_tracking_events = {
        attach: function(context, settings) {

         
        //console.log(Drupal.settings['dtp_tracking_events']);
        var gaData = Drupal.settings['dtp_tracking_events'];

        var ga_id = gaData.ga_id;
        var _tracker = ga('create', ga_id); 
        ga('send', 'pageview');


        var currentdate = new Date(); 
        var datetime =  currentdate.getTime()/1000;
        var smil = '';

        function trackFPEvent(clip, event, player){
           
           //console.log('Ajax call for ', arguments);            
           smil = clip.originalUrl.split('/').pop();

           console.log(secondsToHms(clip.duration));

            jQuery.ajax({
                type: "GET",
                url: "tracking_events_ajax",
                data: {url: clip.url, event: event},                
            });
         
            //set metrics
            ga('set', {
                      'metric1': 1,                     //play time , Total views
                      'metric2': player.getTime(),      //total minutes watched    
                      //'metric2': clip.duration,                  //duration           move it to dimensions
                      //'metric3': datetime,                       //Last played        move to dimensins                     
                      //'metric5': 1                                 //Total watch time
            });         

            /** set dimensions */
             ga('set', {
                      'dimension1' : gaData.user_id,             //User id
                      'dimension2' : gaData.section,             //Web Site Section 
                      'dimension3' : gaData.production,          //product title or production
                      'dimension4' : gaData.institution_name,    //Institutin Name or department
                      'dimension5' : gaData.genre,               //Video genre
                      'dimension6' : smil,                       //video url .smil 
                      'dimension7' : gaData.user_name,           //user_name or department id
                      'dimension8' : gaData.video_type,          //the type of video
                      'dimension9' : gaData.user_subscribe,      //subscribe product package
                      'dimension10': gaData.last_played,          //Last played data-time
                      'dimension11': secondsToHms(clip.duration)   //full duration of the video
            });          

            ga('send', {
                      'hitType': 'event',               // Required.
                      'eventCategory': 'dtp_videos',   // Required.
                      'eventAction': event,            // Required.
                      'eventLabel':  clip.url

            });

        }

        
        flowplayer().onBeforeBegin(function() {
            //attach events to clip
            this.getClip()
                .onResume(function(clip) {
                    trackFPEvent(clip, 'Resume', this);
                })
                .onStart(function(clip) {
                    trackFPEvent(clip, 'Play', this);                
                })
                .onPause(function(clip) {
                    trackFPEvent(clip, 'Pause', this);
                })
                .onStop(function(clip) {                    
                    trackFPEvent(clip, 'Stop', this);
                })
                .onFinish(function(clip) {                    
                    trackFPEvent(clip, 'Finish', this);
                })
        });
        
}}

})(jQuery);