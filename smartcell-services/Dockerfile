FROM php:8.4-fpm-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        intl \
        gd \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    PATH="/root/.config/composer/vendor/bin:/root/.composer/vendor/bin:${PATH}"

RUN chmod +x /usr/bin/composer \
    && composer --version \
    && composer global require laravel/installer --no-interaction \
    && BIN="$(composer global config bin-dir --absolute)" \
    && test -x "${BIN}/laravel" \
    && ln -sf "${BIN}/laravel" /usr/local/bin/laravel \
    && laravel --version

# PHP-FPM escuchando desde otros contenedores
RUN sed -i 's/listen = 127.0.0.1:9000/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf \
    && php-fpm -t \
    && echo "upload_max_filesize = 50M" >> /usr/local/etc/php/php.ini \
    && echo "post_max_size = 50M" >> /usr/local/etc/php/php.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/php.ini

WORKDIR /var/www/html

CMD ["php-fpm"]