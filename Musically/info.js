const TitleEl = document.getElementById("title")
const AuthorEl = document.getElementById("author")
const ImageEl= document.getElementById("image")


function livelyCurrentTrack(data) {
    let obj = JSON.parse(data);
    //when no track is playing its null
    if (obj != null)
    {
      ImageEl.src = "data:image/png;base64, " + obj.Thumbnail

      TitleEl.innerHTML = obj.Title
      AuthorEl.innerHTML = obj.Artist
    }
  }


setTimeout(livelyCurrentTrack,5000)