<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if ($user && $request->is('/')) {
            return redirect()->route('dashboard');
        }

        if (!$user) {
            return redirect()->route('login');
        }

        if (!in_array($user->role, $roles)) {

            $previousUrl = session()->get('last_allowed_url', route('dashboard'));

            return redirect($previousUrl)->with(
                'error',
                'You do not have permission to access this page.'
            );
        }

        session(['last_allowed_url' => $request->fullUrl()]);

        return $next($request);
    }
}
