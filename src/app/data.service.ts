// adding pagination
import { tap } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { url } from 'inspector';

const first: string = "";
const prev: string = "";  
const next: string = "";  
const last: string = "";

parseLinkHeader(header) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    var links = {};
    parts.forEach( p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first  = links["first"];
    this.last   = links["last"];
    this.prev   = links["prev"];
    this.next   = links["next"]; 
  }

  public sendGetRequest(){
    // Add safe, URL encoded _page and _limit parameters 

    return this.httpClient.get(this.SERVER_URL, {  params: new HttpParams({fromString: "_page=1&_limit=20"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap(res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

public sendGetRequestToUrl(url: string) {  
	return this.httpClient.get(url, { observe: "response"}).pipe(retry(3), 			
	catchError(this.handleError), tap(res => {  
		console.log(res.headers.get('Link'));  
		this.parseLinkHeader(res.headers.get('Link'));
	}));  
}