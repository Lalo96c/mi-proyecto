<?php

test('la raíz responde json', function () {
    $response = $this->get('/');

    $response->assertOk()
        ->assertJsonPath('message', 'API Laravel');
});

test('health check', function () {
    $this->get('/up')->assertOk();
});

test('login requiere credenciales', function () {
    $this->postJson('/api/auth/login', [])
        ->assertStatus(422);
});
