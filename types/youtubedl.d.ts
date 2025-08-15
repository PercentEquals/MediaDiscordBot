export interface YoutubeDLJson {
  id: string
  formats: Format[]
  subtitles: Subtitles
  http_headers: HttpHeaders2
  channel: string
  channel_id: string
  uploader: string
  uploader_id: string
  channel_url: string
  uploader_url: string
  track: string
  artists: string[]
  duration: number
  title: string
  description: string
  timestamp: number
  view_count: number
  like_count: number
  repost_count: number
  comment_count: number
  thumbnails: Thumbnail[]
  webpage_url: string
  original_url: string
  webpage_url_basename: string
  webpage_url_domain: string
  extractor: string
  extractor_key: string
  playlist: any
  playlist_index: any
  thumbnail: string
  display_id: string
  fulltitle: string
  duration_string: string
  upload_date: string
  release_year: any
  artist: string
  requested_subtitles: any
  _has_drm: any
  epoch: number
  ext: string
  vcodec: string
  acodec: string
  format_id: string
  tbr: number
  quality: number
  format_note: any
  preference: number
  filesize: number
  filesize_approx: number
  width: number
  height: number
  url: string
  protocol: string
  video_ext: string
  audio_ext: string
  vbr: any
  abr: any
  resolution: string
  dynamic_range: string
  aspect_ratio: number
  cookies: string
  format: string
  _filename: string
  filename: string
  _type: string
  _version: Version
}

export interface Format {
  ext: string
  vcodec: string
  acodec: string
  format_id: string
  url: string
  format_note?: string
  preference: number
  protocol: string
  video_ext: string
  audio_ext: string
  vbr: any
  abr: any
  tbr?: number
  resolution?: string
  dynamic_range: string
  aspect_ratio?: number
  filesize_approx: any
  cookies: string
  http_headers: HttpHeaders
  format: string
  quality?: number
  filesize?: number
  width?: number
  height?: number
}

export interface HttpHeaders {
  "User-Agent": string
  Accept: string
  "Accept-Language": string
  "Sec-Fetch-Mode": string
  Referer: string
}

export interface Subtitles {}

export interface HttpHeaders2 {
  "User-Agent": string
  Accept: string
  "Accept-Language": string
  "Sec-Fetch-Mode": string
  Referer: string
}

export interface Thumbnail {
  id: string
  url: string
  preference: number
}

export interface Version {
  version: string
  current_git_head: any
  release_git_head: string
  repository: string
}
