RUBY = ruby
NODE = node
SASS = $(RUBY) -S sass
BROWSERIFY = $(NODE) node_modules/.bin/browserify -t coffeeify --extension=".coffee" -t envify -t uglifyify
EXORCIST = $(NODE) node_modules/.bin/exorcist
UGLIFYJS = $(NODE) node_modules/.bin/uglifyjs

SOURCE = app/assets
BUILD = assets

.PHONY: default
default: build

.PHONY: all
all: default

.PHONY: js
js: $(BUILD)/main.js

.PHONY: css
css: fonts $(BUILD)/main.css

$(BUILD):
	mkdir -p $(BUILD)

.PHONY: fonts
fonts: $(BUILD)
	mkdir -p $(BUILD)/fonts
	cp node_modules/font-awesome/fonts/*-webfont* $(BUILD)/fonts

.PHONY: $(BUILD)/main.js
$(BUILD)/main.js: $(BUILD)
	NODE_ENV=development $(BROWSERIFY) --debug $(SOURCE)/main.coffee | $(EXORCIST) $(BUILD)/main.js.map > $(BUILD)/main.js

.PHONY: $(BUILD)/main.css
$(BUILD)/main.css: $(BUILD)
	$(SASS) -Inode_modules -I$(SOURCE) --style nested $(SOURCE)/main.sass $(BUILD)/main.css

.PHONY: $(BUILD)/main.min.js
$(BUILD)/main.min.js: $(BUILD)
	NODE_ENV=production $(BROWSERIFY) $(SOURCE)/main.coffee | $(UGLIFYJS) -m -c > $(BUILD)/main.min.js 2> /dev/null

.PHONY: $(BUILD)/main.min.css
$(BUILD)/main.min.css: $(BUILD)
	$(SASS) -Inode_modules -I$(SOURCE) --style compressed $(SOURCE)/main.sass $(BUILD)/main.min.css

.PHONY: build
build: fonts $(BUILD)/main.js $(BUILD)/main.css

.PHONY: min
min: fonts $(BUILD)/main.min.js $(BUILD)/main.min.css

.PHONY: clean
clean:
	rm -rf $(BUILD)/*
