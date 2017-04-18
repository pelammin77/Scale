var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var innerW = window.innerWidth;
var innerH = window.innerHeight;
var gameRatio = innerW / innerH;
var leveys = Math.ceil(800 * gameRatio);
var korkeus = 800;
var infoText;
var kierroksenKuulat;
var sallittuErotus;
var taso;
var pallojaKaytossa;
var erotus;
var MAX_KIERROKSET = 4;
var MAX_TASOT = 8;
var game = new Phaser.Game(800, 1300, Phaser.AUTO, 'content', {
    create: this.create, preload: this.preload
});
var KUULAN_MAX_KOKO = 60;
var KUULAN_KASVU_NOPEUS = 1.5;
var VAAKAN_KITKA = 400;
var VAAKANY = 600;
var kuppi;
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super.call(this) || this;
    }
    BootState.prototype.create = function () {
        game.state.start('preload');
    };
    return BootState;
}(Phaser.State));
var PreloadState = (function (_super) {
    __extends(PreloadState, _super);
    function PreloadState() {
        return _super.apply(this, arguments) || this;
    }
    PreloadState.prototype.preload = function () {
        /*
       ladataan kuvat ja äänet
       */
        game.load.image('vaaka', 'kuvat/vaaka.png');
        game.load.image('kuula', 'kuvat/kuula.png');
        game.load.image('tausta1', 'kuvat/sky1.png');
        game.load.image('labelMessage', 'kuvat/message_label.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    };
    PreloadState.prototype.create = function () {
        // game.stage.backgroundColor = "C3C3C3";
        //   game.add.tileSprite(0, 0, game.width, game.height, 'tausta1');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.updateLayout();
        game.state.start('title');
    };
    return PreloadState;
}(Phaser.State));
var TitleState = (function (_super) {
    __extends(TitleState, _super);
    function TitleState() {
        var _this = _super.apply(this, arguments) || this;
        _this.WebFontConfig = {
            //  'active' means all requested fonts have finished loading
            //  We set a 1 second delay before calling 'createText'.
            //  For some reason if we don't the browser cannot render the text the first time it's created.
            active: function () { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
                families: ['Revalia']
            }
        };
        return _this;
    }
    TitleState.prototype.create = function () {
        game.stage.backgroundColor = "C3C3C3";
        taso = 1;
        this.createText();
        game.input.onTap.addOnce(this.aloita);
    };
    TitleState.prototype.createText = function () {
        //var  textHeader = "Level"+ taso
        // var text = "Use "+kierroksenKuulat+" to ballance the scale\n"
        // +"Max diffe is "+ erotus; 
        var text = null;
        var style = {};
        //text = game.add.text(game.world.centerX,"SCALE" ,style);
        text = game.add.text(game.world.centerX, 100, "SCALE", style);
        text.anchor.setTo(0.5);
        text.font = 'Revalia';
        text.fontSize = 80;
        //  x0, y0 - x1, y1
        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#004CB3');
        text.fill = grd;
        text.align = 'center';
        text.stroke = '#000000';
        text.strokeThickness = 2;
        text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    };
    TitleState.prototype.aloita = function () {
        game.state.start('preLevel');
    };
    return TitleState;
}(Phaser.State));
var PreLevelState = (function (_super) {
    __extends(PreLevelState, _super);
    function PreLevelState() {
        var _this = _super.apply(this, arguments) || this;
        _this.WebFontConfig = {
            //  'active' means all requested fonts have finished loading
            //  We set a 1 second delay before calling 'createText'.
            //  For some reason if we don't the browser cannot render the text the first time it's created.
            active: function () { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
                families: ['Revalia']
            }
        };
        return _this;
    }
    PreLevelState.prototype.create = function () {
        asetaTasonTiedot();
        this.createText();
        game.input.onTap.addOnce(this.aloitaPeli);
    };
    PreLevelState.prototype.createText = function () {
        //var  textHeader = "Level"+ taso
        // var text = "Use "+kierroksenKuulat+" to ballance the scale\n"
        // +"Max diffe is "+ erotus; 
        var text = null;
        var style = {};
        text = game.add.text(game.world.centerX, game.world.centerY, "Level " + taso + "\n" + "Available balls " + kierroksenKuulat
            + "\n Max distance " + sallittuErotus, style);
        text.anchor.setTo(0.5);
        text.font = 'Revalia';
        text.fontSize = 80;
        //  x0, y0 - x1, y1
        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#004CB3');
        text.fill = grd;
        text.align = 'center';
        text.stroke = '#000000';
        text.strokeThickness = 2;
        text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        //text.inputEnabled = true;
    };
    PreLevelState.prototype.aloitaPeli = function () {
        game.state.start("gameOn");
    };
    return PreLevelState;
}(Phaser.State));
var GameOnState = (function (_super) {
    __extends(GameOnState, _super);
    function GameOnState() {
        var _this = _super.apply(this, arguments) || this;
        _this.vaaka = [];
        return _this;
    }
    GameOnState.prototype.create = function () {
        //  game.stage.backgroundColor = "C3C3C3";
        //       this.tausta =  game.add.tileSprite(0, 0, game.width, game.height, 'tausta1');
        // this.sallittuErotus;   
        this.kaikkiPallotKaytetty = false;
        //this.varaKuullat = 3;
        this.kuulaKasvaa = false;
        this.kierros = 1;
        // taso = 1; 
        //        
        // this.asetaTasonTiedot();
        this.luoUusiKierros();
        //this.koneLuoKuulat(4,25,25);
    };
    GameOnState.prototype.tasoSuoritettu = function () {
    };
    GameOnState.prototype.peliSuoritettu = function () {
    };
    GameOnState.prototype.vaihdaTaso = function () {
        this.kierros = 1;
        taso++;
        game.state.start('preLevel');
        //asetaTasonTiedot();
    };
    GameOnState.prototype.luoUusiKierros = function () {
        if (this.kierros > MAX_KIERROKSET) {
            this.vaihdaTaso();
        }
        asetaTasonTiedot();
        game.world.removeAll();
        //game.add.sprite(0,0,'tausta1');
        game.add.tileSprite(0, 0, game.width, game.height, 'tausta1');
        this.luoVaaka();
        this.aloitaKierros();
    };
    GameOnState.prototype.aloitaKierros = function () {
        //game.paused = true;
        this.vaakaTasapainossa = false;
        this.labelKierroksenKuulat = game.add.text(100, game.height - 100, "Balls: " + kierroksenKuulat, { font: "50px Arial", fill: "#ffffff" });
        this.labelSallittuErotus = game.add.text(100, game.height - 50, "Max difference:" + sallittuErotus, { font: "50px Arial", fill: "#ffffff" });
        this.labelTaso = game.add.text(300, 20, "LEVEL:" + taso + "/" + MAX_TASOT, { font: "50px Arial", fill: "#ffffff" });
        this.labelKierros = game.add.text(10, 20, "ROUND:" + this.kierros + "/" + MAX_KIERROKSET, { font: "50px Arial", fill: "#ffffff" });
        this.pelaajanVuoro = false;
        this.koneLuoKuulat();
    };
    GameOnState.prototype.laskePaino = function () {
        if (this.onkoVaakaTasapainossa() == true) {
            var label = game.add.sprite(0, 200, 'labelMessage');
            label.alpha = 0.7;
            label.tint = 0x41A500;
            kirjoitaViesti(2);
            this.kierros++;
            this.game.time.events.add(Phaser.Timer.SECOND * 3, this.luoUusiKierros, this);
        }
        if (kierroksenKuulat == 0 && this.onkoVaakaTasapainossa() == false && this.onkoSallituissaRajoissa() == true) {
            var label = game.add.sprite(0, 200, 'labelMessage');
            label.alpha = 0.7;
            label.tint = 0x41A500;
            kirjoitaViesti(3);
            this.kierros++;
            this.game.time.events.add(Phaser.Timer.SECOND * 3, this.luoUusiKierros, this);
        }
        if (kierroksenKuulat == 0 && this.onkoSallituissaRajoissa() == false) {
            var label = game.add.sprite(0, 200, 'labelMessage');
            label.alpha = 0.7;
            label.tint = 0xCC1831;
            kirjoitaViesti(4);
            this.game.time.events.add(Phaser.Timer.SECOND * 3, this.lopeta, this);
        }
        if (this.painonMuutos > 270)
            this.lopeta();
        else {
            this.uusiKuulaVoiPudota();
        }
    };
    GameOnState.prototype.lopeta = function () {
        game.state.start("gameOver");
    };
    GameOnState.prototype.onkoVaakaTasapainossa = function () {
        if (this.painonMuutos == 0) {
            this.vaakaTasapainossa = true;
            return true;
        }
        return false;
    };
    GameOnState.prototype.onkoSallituissaRajoissa = function () {
        if (this.painonMuutos <= sallittuErotus) {
            return true;
        }
        else {
            return false;
        }
    };
    GameOnState.prototype.update = function () {
        if (this.kuulaKasvaa == true && this.kuula.width < KUULAN_MAX_KOKO) {
            this.kasvataKuulaa();
        }
    };
    GameOnState.prototype.luoVaaka = function () {
        this.vaaka[0] = game.add.group();
        this.vaaka[1] = game.add.group();
        this.vaaka[0].paino = 0;
        this.vaaka[1].paino = 0;
        var vaakaKuva = game.add.sprite(0, VAAKANY, 'vaaka');
        this.vaaka[0].add(vaakaKuva);
        vaakaKuva = game.add.sprite(410, VAAKANY, "vaaka");
        this.vaaka[1].add(vaakaKuva);
    };
    GameOnState.prototype.liikutaVaakaa = function () {
        this.painonMuutos = (this.vaaka[0].paino - this.vaaka[1].paino) / VAAKAN_KITKA;
        console.log("vaaka 0 " + this.vaaka[0].paino);
        console.log("vaaka 1 " + this.vaaka[1].paino);
        var balanceTween = game.add.tween(this.vaaka[0]).to({
            y: this.painonMuutos
        }, 2000, Phaser.Easing.Quadratic.Out, true);
        var balanceTween2 = game.add.tween(this.vaaka[1]).to({
            y: -this.painonMuutos
        }, 2000, Phaser.Easing.Quadratic.Out, true);
        balanceTween.onComplete.add(this.laskePaino, this);
        this.painonMuutos = Math.abs(this.painonMuutos);
        this.painonMuutos = this.painonMuutos / 2;
        this.painonMuutos = Math.round(this.painonMuutos);
        console.log("muutos: " + this.painonMuutos);
        erotus = this.painonMuutos;
        console.log(erotus);
    };
    GameOnState.prototype.kuulanLuonti = function (xPaikka, yPaikka, w, h) {
        this.kuula = game.add.sprite(xPaikka, 400, "kuula");
        if (this.kuula.x < 400) {
            kuppi = 0;
        }
        else {
            kuppi = 1;
        }
        this.asetaKuulanArvot(w, h);
        this.vaaka[kuppi].add(this.kuula);
    };
    GameOnState.prototype.asetaKuulanArvot = function (w, h) {
        this.kuula.anchor.x = 0.5;
        this.kuula.anchor.y = 0.5;
        this.kuula.width = w;
        this.kuula.height = h;
    };
    GameOnState.prototype.koneLuoKuulat = function () {
        var paikka = 500;
        for (var i = 0; i < this.kierros; i++) {
            var koko = Math.random() * ((KUULAN_MAX_KOKO - 30) + 1) + 30;
            var jakaja = i;
            if (jakaja == 0)
                jakaja = 1;
            else {
                jakaja += 1;
            }
            koko = koko / jakaja;
            console.log("koko: " + koko);
            this.kuulanLuonti(paikka, 100, koko, koko);
            this.vaaka[kuppi].add(this.kuula);
            this.tiputaKuula();
            paikka += koko + 25;
        }
    };
    GameOnState.prototype.pelaajaLuoKuulan = function () {
        if (kierroksenKuulat < 1)
            return;
        if (this.vaakaTasapainossa == true)
            return;
        this.pelaajanVuoro = true;
        this.kuulanLuonti(game.input.worldX, game.input.worldY, 1, 1);
        this.vaaka[kuppi].add(this.kuula);
        game.input.onDown.remove(this.pelaajaLuoKuulan, this);
        game.input.onUp.add(this.tiputaKuula, this);
        this.kuulaKasvaa = true;
    };
    GameOnState.prototype.kasvataKuulaa = function () {
        // console.log("kasva");
        this.kuula.width += KUULAN_KASVU_NOPEUS;
        this.kuula.height += KUULAN_KASVU_NOPEUS;
    };
    GameOnState.prototype.tiputaKuula = function () {
        this.kuulaKasvaa = false;
        game.input.onUp.remove(this.tiputaKuula, this);
        if (this.pelaajanVuoro == true)
            kierroksenKuulat--;
        this.labelKierroksenKuulat.text = "Balls: " + kierroksenKuulat;
        var kuulanLiike = VAAKANY - this.kuula.height / 2;
        this.vaaka[kuppi].paino += (4 / 3) * Math.PI * (this.kuula.width / 2) * (this.kuula.width / 2) * (this.kuula.width / 2);
        var ballTween = game.add.tween(this.kuula).to({
            y: kuulanLiike
        }, 2000, Phaser.Easing.Bounce.Out, true);
        // call adjustBalances function once the tween is over
        ballTween.onComplete.add(this.liikutaVaakaa, this);
    };
    GameOnState.prototype.uusiKuulaVoiPudota = function () {
        game.input.onDown.add(this.pelaajaLuoKuulan, this);
    };
    return GameOnState;
}(Phaser.State));
var GameOverState = (function (_super) {
    __extends(GameOverState, _super);
    function GameOverState() {
        var _this = _super.apply(this, arguments) || this;
        _this.WebFontConfig = {
            active: function () { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
            google: {
                families: ['Revalia']
            }
        };
        return _this;
    }
    GameOverState.prototype.create = function () {
        game.stage.backgroundColor = "C3C3C3";
        this.createText();
    };
    GameOverState.prototype.reStart = function () {
        taso = 1;
        game.state.start("title");
    };
    GameOverState.prototype.continueGame = function () {
        game.state.start("preLevel");
    };
    GameOverState.prototype.createText = function () {
        var text = null;
        var style = {};
        text = game.add.text(game.world.centerX, 100, "Game Over", style);
        var textContinue = game.add.text(game.world.centerX - 300, 500, "Continue", style);
        var texttextBackToMainMenu = game.add.text(game.world.centerX - 300, 700, "Back to the main", style);
        text.anchor.setTo(0.5);
        text.font = 'Revalia';
        text.fontSize = 80;
        //  x0, y0 - x1, y1
        var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#004CB3');
        text.fill = grd;
        text.align = 'center';
        text.stroke = '#000000';
        text.strokeThickness = 2;
        text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        textContinue.inputEnabled = true;
        textContinue.events.onInputDown.add(this.continueGame, this);
        texttextBackToMainMenu.inputEnabled = true;
        texttextBackToMainMenu.events.onInputDown.add(this.reStart, this);
    };
    return GameOverState;
}(Phaser.State));
game.state.add('bootState', BootState, true);
game.state.add('preload', PreloadState);
game.state.add('title', TitleState);
game.state.add('preLevel', PreLevelState);
game.state.add('gameOn', GameOnState);
game.state.add('gameOver', GameOverState);
function kirjoitaViesti(i) {
    var style;
    var text;
    switch (i) {
        case 1:
            text = "Ballance the scale with " + kierroksenKuulat + " balls" +
                "\n Maximum difference is " + this.sallittuErotus;
            break;
        case 2:
            text = "Perfect! Difference is 0\n " +
                "Difference:" + erotus +
                " Max difference was:" + sallittuErotus;
            style = { font: "35px Arial", fill: "#19070B", align: "center" };
            break;
        case 3:
            text = "You passed!\n" +
                "Difference:" + erotus +
                " Max difference was:" + sallittuErotus;
            style = { font: "35px Arial", fill: "#19070B", align: "center" };
            break;
        case 4:
            text = "GAME OVER\n" +
                "Scale separation is too great\n" +
                "Difference:" + erotus +
                "\nMax difference was:" + sallittuErotus;
            style = { font: "35px Arial", fill: "#19070B", align: "center" };
            break;
    }
    game.add.text(100, 200, text, style);
}
function asetaTasonTiedot() {
    switch (taso) {
        case 1:
            kierroksenKuulat = 3;
            sallittuErotus = 5;
            break;
        case 2:
            kierroksenKuulat = 3;
            sallittuErotus = 3;
            break;
        case 3:
            kierroksenKuulat = 3;
            sallittuErotus = 1;
            break;
        case 4:
            kierroksenKuulat = 2;
            sallittuErotus = 5;
            break;
        case 5:
            kierroksenKuulat = 2;
            sallittuErotus = 3;
            break;
        case 6:
            kierroksenKuulat = 2;
            sallittuErotus = 1;
            break;
        case 7:
            kierroksenKuulat = 3;
            sallittuErotus = 0;
            break;
        case 8:
            kierroksenKuulat = 2;
            sallittuErotus = 0;
        default:
            this.peliSuoritettu();
    }
}
