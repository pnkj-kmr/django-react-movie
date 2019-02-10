"""
This module helps to map the movie with OMDb
"""

# API KEY
# http://www.omdbapi.com/?i=tt3896198&apikey=4bad8a5
import requests
import traceback
import json

class OMDbAPI:
    """Class helps to fetch the data from OMDb API
    """
    API_KEY = "4bad8a5"
    API_URL = "http://www.omdbapi.com/"

    KEY_MAP = {
        "i": ["imdbID"],
        "t": ["title", "name"],
        "y": ["year"],
        "type": ["type", "content"],
    }

    def __init__(self, *args, **kwargs):
        pass

    def form_params(self, params, request={}):
        """function helps to form the params based on input
        """
        key_map = self.KEY_MAP
        temp = {}
        if isinstance(params, dict):
            for k, v in key_map.items():
                if k in params:
                    temp[k] = params[k]
                for key in params.keys():
                    if key in v:
                        temp[k] = params[key]
        if isinstance(params, str):
            temp["t"] = params
        return temp

    def form_response(self, resp={}):
        """Function help to form the response
            according to application
        """
        try:
            if resp.get("Title") in ("", None, "None"):
                return []
            return [{
                "name":         resp.get("Title", ""),
                "author":       resp.get("Director", ""),
                "description":  "%s | %s | %s | %s | %s" % (
                                        resp.get("Genre", ""),
                                        resp.get("Actors", ""),
                                        resp.get("Writer", ""),
                                        resp.get("Language", ""),
                                        resp.get("Plot", ""),
                                    ),
                "creationdate": resp.get("Released", ""),
                "image_url":    resp.get("Poster", "")
            }]
        except:
            traceback.print_exc()
        return []
        
    
    def get_request(self, params, request={}):
        """Function helps to ftech data from OMD
        """
        ret = {}
        try:
            url = self.API_URL
            params = self.form_params(params, request=request)
            params['apikey'] = self.API_KEY
            
            # API request
            ret = requests.get(url, params=params)

            if ret.status_code == 200:
                content = ret.text
                if isinstance(content, str):
                    content = json.loads(content)
                ret = content
            else:
                ret = {}
        except:
            traceback.print_exc()
        return ret


if __name__ == "__main__":
    db = OMDbAPI()
    # print(requests.get.__doc__)
    params = {
        "t": "Simmba"
        # "y": "2019"
    }
    ret = db.get_request(params)
    print(ret)
    # print(json.dumps(ret, indent=4))



sample_response = """
{
    "Title": "Simmba",
    "Year": "2018",
    "Rated": "N/A",
    "Released": "28 Dec 2018",
    "Runtime": "158 min",
    "Genre": "Action, Comedy, Drama",
    "Director": "Rohit Shetty",
    "Writer": "Puri Jagannadh (original story), Vakkantham Vamsi (original story), Yunus Sajawal (screenplay), Sajid (screenplay), Farhad Samji (dialogue)",
    "Actors": "Ranveer Singh, Sara Ali Khan, Ajay Devgn, Karan Johar",
    "Plot": "Simmba, a Corrupt Officer, enjoys all the perks of being an immoral and unethical police officer until a life-changing event forces him to choose the righteous path.",
    "Language": "Marathi, English, Hindi",
    "Country": "India",
    "Awards": "N/A",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTE1MTY0MDQ0NzZeQTJeQWpwZ15BbWU4MDA2NTg3ODYz._V1_SX300.jpg",
    "Ratings": [
        {
            "Source": "Internet Movie Database",
            "Value": "6.6/10"
        },
        {
            "Source": "Rotten Tomatoes",
            "Value": "38%"
        }
    ],
    "Metascore": "N/A",
    "imdbRating": "6.6",
    "imdbVotes": "11,996",
    "imdbID": "tt7212726",
    "Type": "movie",
    "DVD": "N/A",
    "BoxOffice": "N/A",
    "Production": "N/A",
    "Website": "N/A",
    "Response": "True"
}
"""


