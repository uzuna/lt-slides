### AnsibleでArch Linuxをインストールする
2016/01/09 LTDD#22

---

あけましておめでとうございます


---

### 自己紹介

|||
|:---|:---|
|名前|uzuna|
|仕事|製造系:製品解析|
|趣味|読書|
|twitter|@Uzundk|
|読書メーター|同上|
|よく使う|nodejs(ES2015)|

---

12月のお勧め図書

<img class="img" src="image/201601_potate.jpg" width="120px">

* ジャガイモ学ポテトサラダ文化論
* 発刊 2015年12月31日
* 著者 大谷号

--

## ジャガイモ学
### ポテトサラダ文化論

--


## ポテトサラダとはなにか

--

ポテトサラダといえば思い浮かべるもの

* サイコロあるいは潰したジャガイモ
* マヨネーズ
* 卵
* きゅうり

--

ところが他の国を覗いてみると意外と違う

|国|ジャガイモ形状|野菜|味付け|
|:--|:--|:--|:--|
|ドイツ|輪切り|パセリ|ブイヨン, バルサミコ酢|
|フランス|マッシュ|コーン|マヨネーズ, レモン汁|
|アメリカ|サイコロ|パプリカ|マヨネーズ, 酢, マスタード|
|イギリス|一口|不定|マヨネーズ, ドレッシング|
|日本|サイコロ-マッシュ|きゅうり|マヨネーズ|


--

日本ポテトサラダの定義

* ジャガイモが入っていること
* 食べやすいサイズに加工されていること

--

### 日本ポテトサラダ先史時代

明治21年(1881)には料理本のなかに存在が認められた。

ジャガイモを利用したサラダの名称  
この頃は西洋料理として紹介されていた

--

### 日本ポテトサラダ古代

大正14年(1925) キューピーマヨネーズ発売  
マヨネーズであえたポテトサラダが主流に。

--

### 日本ポテトサラダ現代

昭和57年(1982)
小学校家庭科教科書掲載  
この頃には今のポテトサラダがデファクトスタンダードになる

--

## ジャガイモ自体の歴史

* 紀元前7000年ごろにはすでに南米で主食
* 1500年代に航海の発達でスペインにもたらされる
* 1650年ごろにはドイツ、フランケン地方で初栽培

* 小麦に変わる痩せた土地でもなる食料として重宝

--

品種

* ふかして美味しいもの
* 煮込みに強いもの
* 片栗粉原料
* ポテチ専用

--

身近だけどあんまり知らないジャガイモのことを  
実用的な意味でも知ることのできる大変面白い本です

---

というわけで本題

---

### AnsibleでArch Linuxをインストールする

---

結論:うまくいきませんでした 

---

__back ground__

--

持っているPC

|Type|Usage|
|:--|:--|
|Macbook Air|持ち出し用|
|Win10|メイン機|
|Ubuntu|お試し用|

展開先がWin環境なので、だいたいwinで事足りていた。

--

しかし...

1. Win10にしてから謎のフリーズが多い
2. クリーンインストールする気もない
3. Linuxだったら使えるnpmパッケージが増える

__ ->もうLinuxで開発すればいいんじゃ...?__

--

そこでUbuntuを試すも

1. 起動が遅い(割と耐え難い)
2. Updateが重いしよく失敗する(致命的)
3. ソフトのバージョンが古い(新しもの好き)
4. VM内のMintの方が快適だった(ぉ)

--

気が付き

* GNOMEが重い -> 他にも選択肢がある
* 私がローカルに必須なのはsublime textとnodejsだけ
* それ以外はDockerできれば何でもいい

--

もうちょっと使いやすく触りやすいものを探そう。

必要なものだけ入って、自分で触れて、十分に新しいものを

--

__Arch Linux__

---

### Arch Linux とは

* ディストリビューションの一つ  
  最小限の環境を元に使用環境に合わせて必要なものを揃える思想
* インストーラーなし

--

__インストーラーなし__


--

そこで

### AnsibleでArch Linuxをインストールする

なのですが

--

<img class="img" src="image/2016_01_lose.jpg" width="600px">

わたしのかがくりょくではできませんでした


--

なので、Ansibleが動くまでの過程を紹介します

---

### install工程

1. パーティション作成
2. 適切にマウントしベースシステムをインストール
3. ブートローダーのインストール

--

### パーティション作成

`parted`を使って作成(ブートの戦略を先に決める)  
そもそもブートローダーの仕組みをわかってなくてとりあえず手順に従う

--

* bootはUEFIから行う
* rootはext4でフォーマットする

```shell-session
parted /dev/sda
mkpart ESP fat32 1MiB 513MiB
set 1 boot on
mkpart primary ext4 513MiB 100%
quit
mkfs.vfat -F32 /dev/sda1
mkfs.ext4 /dev/sda2
```

--

#### 適切にマウントしてベースシステムをインストールする

```shell-session
mount /dev/sda2 /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot

pacstrap -i /mnt base base-devel
```

--

#### chrootで初期設定を行う

再起動後のためにDHCP有効化を忘れずに

```shell-session
arch-chroot /mnt /bin/bash

# locale-gen
# timezone

echo machinename > /etc/hostname
systemctl enable dhcpcd

```

--

### ブートローダーを設定

いろいろ手順はあったがこれが今のところ楽ちん  
ただしVboxだと起動しないなどもある

```shell-session
## boot loader UFI
pacman -S refind-efi
refind-install

# vboxの場合はgrubじゃないと起動しないかも
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader=grub --recheck
grub-mkconfig -o /boot/grub/grub.cfg

exit

reboot
```

--

### ansibleで操作できるようにセットアップ

1. sshdを起動
2. python2をinstall
3. useradd


--

sshとpython2をインストール  
archのデフォルトはpython3

```shell-session
pacman -S openssh
systemctl enable sshd
systemctl start sshd

# setup Python2
pacman -Syu
pacman -S python2

# useradd
```

--

これでansibleが接続できるようになりました。

---

この手順、最初のdiskpart前に sshd起動すれば

ssh経由でインストール作業できます

--

なので全てansible化できるのではと期待していたのですが、

ansibleにはPython2が必要で、動かすこと能わず...

--

そもそもansibleの書き方もまだ始めたばかりなので

commandを投げて制御するめどが立ったらやろうと思います

---

学んだこと

* 起動プロセス周りの知識の入り口がわかった
* linuxは怖くない
* VM固有/ハードの違いが起因のトラブルがでるとハマる

--

* hostsでpython2を指定すること
  ansible_python_interpreter=/usr/bin/python2
* ansible操作時に--ask-pass, --ask-sudo-passを許容するかどうか  
  管理戦略が必要

--

* xfce4は軽い
* sublime textで日本語入力ができないのが地味に困ってる

--

とにかく開発環境を簡単に作って壊せるようにしておきたい

再現性を高めて記事にする予定