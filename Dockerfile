FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

RUN a2enmod rewrite

# Set Laravel public as document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# 🔥 IMPORTANT: Allow public folder
RUN echo "<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" >> /etc/apache2/apache2.conf

# 🔥 IMPORTANT: Make Apache listen to Vercel PORT
RUN sed -i 's/80/${PORT}/g' /etc/apache2/ports.conf || true
RUN sed -i 's/:80/:${PORT}/g' /etc/apache2/sites-available/000-default.conf || true

COPY . /var/www/html
WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache

# 🔥 THIS IS CRITICAL
CMD apache2-foreground