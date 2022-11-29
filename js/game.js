setGame("1200x600");
game.folder = "assets";
//file gambar yang dipakai dalam game
var gambar = {
	logo:"logo.png",
	startBtn:"tombolStart.png",
	cover:"cover.jpg",
	playBtn:"btn-play.png",
	maxBtn:"maxBtn.png",
	minBtn:"minBtn.png",
	idle:"Idle.png",
	run:"Run.png",
	jump:"Jump.png",
	fall:"Fall.png",
	hit:"hit.png",
	tileset:"terrain.png",
	bg:"bg.png",
	item1:"Strawberry.png",
	musuh1Idle:"enemy1Idle.png",
	musuh1Run:"enemy1Run.png",
	musuh1Hit:"enemy1Hit.png",
	bendera:"Flag.png",
	yeay:"finsh.jpg"
}
//file suara yang dipakai dalam game
var suara = {
	item1coin:"super mario coin.mp3",
	suaramati:"end.mp3",
	bgm:"sound.mp3",
	suaramusuh:"musuh.mp3",
	next:"menang.mp3",
	finish:"juara.mp3"
}

//load gambar dan suara lalu jalankan startScreen
loading(gambar, suara, startScreen);

function startScreen(){	
	hapusLayar("#67d2d6");
	tampilkanGambar(dataGambar.logo, 600, 250);
	var startBtn = tombol(dataGambar.startBtn, 600, 350);
	if (tekan(startBtn)){
		jalankan(halamanCover);
	}
}
function halamanCover(){
	hapusLayar("#9c9695");
	gambarFull(dataGambar.cover);
	var playBtn = tombol(dataGambar.playBtn, 1100, 500);
	if (tekan(playBtn) || game.spasi){
		if (game.aktif) {
			//mulai game dengan menambahkan transisi
			game.status = "mulai";
			game.level = 1;
			game.score = 0;
			game.warnaTransisi = "#8f8f8f";
			transisi("out", setAwal);
			musik(dataSuara.bgm, 30);
		}
	}	
	resizeBtn(1150,50);
	efekTransisi();
}

function setAwal(){
	game.aktif = true;
	game.hero = setSprite(dataGambar.idle,32,32);
	game.hero.animDiam = dataGambar.idle;
	game.hero.animJalan = dataGambar.run;
	game.hero.animLompat = dataGambar.jump;
	game.hero.animJatuh = dataGambar.fall;
	game.hero.animMati = dataGambar.hit;
	game.skalaSprite = 2;	
	//setPlatform(map_1, dataGambar.tileset, 32, game.hero);
	setPlatform(this["map_"+game.level], dataGambar.tileset, 32, game.hero);
	game.gameOver = ulangiPermainan;
	//set item
	setPlatformItem(1, dataGambar.item1);
	//set musuh
	var musuh1 = {}
	musuh1.animDiam = dataGambar.musuh1Idle;
	musuh1.animJalan = dataGambar.musuh1Run;
	musuh1.animMati = dataGambar.musuh1Hit;
	setPlatformEnemy(1, musuh1);
	//set trigger
	setPlatformTrigger(1, dataGambar.bendera);
	if (game.status == "mulai"){
		game.status = "main";
		mulaiPermainan();
	}
}

function mulaiPermainan(){
	jalankan(gameLoop);
	transisi("in");
}

function ulangiPermainan(){	
	setAwal();	
	game.aktif = true;
	jalankan(gameLoop);
	mainkanSuara(dataSuara.suaramati);	
}
function akhiriPermainan(){	
	gambarFull(dataGambar.yeay);
}

function gameLoop(){
	hapusLayar("#9c9695");
	if (game.kanan){
		gerakLevel(game.hero, 3, 0);
	}else if (game.kiri){				
		gerakLevel(game.hero, -3, 0);
	}
	if (game.atas){
		gerakLevel(game.hero, 0, -10);
	}
		
	latar(dataGambar.bg, 0, 0);
	buatLevel();
	cekItem();
	teks(game.score, 40, 60, "Calibri-bold-20pt-left-biru");
	efekTransisi();
	
}

function cekItem(){
	if (game.itemID > 0){
		tambahScore(10*game.itemID);
		game.itemID = 0;
		mainkanSuara(dataSuara.item1coin, 50);
	}
	if (game.musuhID != 0){
		tambahScore(25);
		game.musuhID = 0;
		mainkanSuara(dataSuara.suaramusuh);
	}
	if (game.triggerID == 1){
		game.triggerID = 0;
		game.aktif = false;
		transisi("out", naikLevel);		
		mainkanSuara(dataSuara.next);
	}
}

function naikLevel(){
	game.level++;
	if (game.level>=6){
		transisi("in");
		jalankan(akhiriPermainan);
		mainkanSuara(dataSuara.finish);
	}else{
		game.status = "mulai";
		setAwal();
	}
}
