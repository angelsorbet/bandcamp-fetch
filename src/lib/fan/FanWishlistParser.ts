import Album from '../types/Album';
import { FanItemsContinuation } from '../types/Fan';
import Track from '../types/Track';
import FanItemsBaseParser, { FanItemParseOptions } from './FanItemsBaseParser';

export default class FanWishlistParser extends FanItemsBaseParser {
  static parseWishlistFromPage(html: string, opts: FanItemParseOptions) {
    return this.parsePageItems(html, {
      ...opts,
      dataKey: 'wishlist',
      parseItemFn: this.parseWishlistItem
    });
  }

  static parseWishlistFromContinuation(json: any, continuation: FanItemsContinuation, opts: FanItemParseOptions) {
    return this.parseContinuationItems(json, continuation, {
      ...opts,
      dataKey: 'items',
      parseItemFn: this.parseWishlistItem
    });
  }

  static parseWishlistItem(data: any, opts: FanItemParseOptions, tracklists: any): Album | Track | null {
    if (!data) {
      return null;
    }

    const _findInTrackLists = (tracklists: any, id: number) => {
      if (!tracklists || typeof tracklists !== 'object') {
        return null;
      }
      for (const tracks of Object.values(tracklists)) {
        if (Array.isArray(tracks)) {
          const track = tracks.find((t: any) => t.id === id);
          if (track) {
            return track;
          }
        }
      }
    };

    let mediaItemType: 'album' | 'track' | null;
    switch (data.tralbum_type) {
      case 'a':
        mediaItemType = 'album';
        break;
      case 't':
        mediaItemType = 'track';
        break;
      default:
        mediaItemType = null;
    }
    if (!mediaItemType) {
      return null;
    }
    const mediaItem: Album | Track = {
      type: mediaItemType,
      name: data.item_title,
      url: data.item_url,
      imageUrl: '',
      artist: {
        name: data.band_name
      }
    };

    if (data.item_art_id && opts.imageFormat?.id) {
      mediaItem.imageUrl = `${opts.imageBaseUrl}/img/a${data.item_art_id}_${opts.imageFormat.id}.jpg`;
    }
    if (data.url_hints && data.url_hints.subdomain && mediaItem.artist) {
      mediaItem.artist.url = `https://${data.url_hints.subdomain}.bandcamp.com`;
    }
    const featuredTrackData = data.featured_track !== undefined ? _findInTrackLists(tracklists, data.featured_track) : null;
    if (featuredTrackData) {
      const duration = featuredTrackData.duration;
      const streamUrl = featuredTrackData.file?.['mp3-128'];
      if (mediaItemType === 'album') {
        (mediaItem as Album).featuredTrack = {
          position: featuredTrackData.track_number,
          name: featuredTrackData.title,
          artist: featuredTrackData.artist,
          duration,
          streamUrl
        };
      }
      else {
        (mediaItem as Track).duration = duration;
        (mediaItem as Track).streamUrl = streamUrl;
      }
    }
    return mediaItem;
  }
}
