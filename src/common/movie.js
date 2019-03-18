export default class Movie {
	constructor({ id, nm, img, time, comment, totalScore }) {
		this.id = id,
			this.nm = nm,
			this.img = img,
			this.time = new Date().getTime(),
			this.comment = comment || '',
			this.totalScore = totalScore || 0
	}
}