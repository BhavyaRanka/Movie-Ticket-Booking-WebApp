const feed = Vue.component("feed", {
  template: `
                <div>
                        <div  v-if="feed_data.length">
                        <div class = "row">
                        <div class="card my-3 mx-3 col-4" style="width: 18rem;" v-for="post in feed_data">
                            <div class="card-body">
                                <h5 class="card-title">Theater Name :<a v-bind:href="'#/theater?name='+ post.theaterName+'&place='+post.theaterPlace">{{ post.theaterName }} </a></h5>
                                <!-- <h6 class="card-subtitle mb-2 text-body-secondary">Username :<a v-bind:href="'#/user?user='+ post.username">{{ post.username }} </a>
                                </h6>-->
                                <p class="card-text">{{post.theaterPlace}}</p>
                                </div>
                                
                                </div>
                                </div>
  </div>
  <div v-else>
  <p> There are no shows available now.</p>
<p> Please check back later.</p>
  </div>
                </div>
    `,
data: function (){
  return {
    feed_data:[]
    
  };
},
mounted: function () {

  fetch("/getalltheater")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data:", data);
      this.feed_data = data;
    });
},
});
export default feed;