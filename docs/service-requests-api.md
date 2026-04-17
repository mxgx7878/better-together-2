# Service Requests — Backend API Spec

Module: **Looking for Services** (participant side) /
**Job Board** (provider side) / **Service Requests** (admin side).

One underlying data source (`service_requests` + `service_request_replies`)
drives all three surfaces:

| Portal          | Surface                     | What the user does                                      |
| --------------- | --------------------------- | ------------------------------------------------------- |
| Participant     | **Looking for Services**    | Posts a request; views public provider replies          |
| Provider (paid) | **Job Board**               | Sees participant requests filtered by their services;   |
|                 |                             | "applies" by posting a public reply with contact info   |
| Provider (free) | **Job Board** (read-only)   | Sees the feed but is blocked from applying              |
| Admin           | **Service Requests**        | Moderates (delete post / reply), sees analytics         |

Frontend is already wired to all endpoints below via Redux thunks in
`src/store/actions/serviceRequestActions.js`. This doc is the contract
the backend needs to implement so the UI works end-to-end.

All endpoints are authenticated (Bearer token, same as the rest of the
API). Validation errors should follow the existing Laravel format the
client already handles:

```json
{ "message": "Validation failed", "errors": { "field": ["..."] } }
```

---

## 1. Data model

### `service_requests`

| Column         | Type                                      | Notes                                             |
| -------------- | ----------------------------------------- | ------------------------------------------------- |
| `id`           | bigint PK                                 |                                                   |
| `user_id`      | FK → `users.id` (participant)             | author                                            |
| `service_type` | string (120)                              | e.g. "Occupational Therapist"                     |
| `category_id`  | FK → `categories.id`, nullable            | used to match providers on the Job Board          |
| `location`     | string (160), nullable                    | free text                                         |
| `needed_from`  | string (80), nullable                     | free text (e.g. "After May 2026"), not a date col |
| `summary`      | text                                      | the full request description                      |
| `status`       | enum(`open`,`closed`), default `open`     | author or admin can close                         |
| `created_at`   | timestamp                                 |                                                   |
| `updated_at`   | timestamp                                 |                                                   |

### `service_request_replies`

| Column               | Type                                | Notes                                   |
| -------------------- | ----------------------------------- | --------------------------------------- |
| `id`                 | bigint PK                           |                                         |
| `service_request_id` | FK → `service_requests.id` CASCADE  |                                         |
| `provider_user_id`   | FK → `users.id` (provider)          | author of the reply                     |
| `message`            | text                                |                                         |
| `contact_email`      | string, nullable                    | may differ from provider's account email|
| `contact_phone`      | string, nullable                    |                                         |
| `created_at`         | timestamp                           |                                         |
| `updated_at`         | timestamp                           |                                         |

### Business rules

- Only users with role `participant` can create a `service_request`.
- Only users with role `provider` AND `tier === 'paid'` can create a
  `service_request_reply`. Free providers get 403.
- A provider can only reply **once** per request — enforce with a unique
  index on `(service_request_id, provider_user_id)`.
- Replies are **public** to every authenticated user on the platform.
  The UI intentionally does not allow a provider to DM the poster; the
  only contact is through the public reply.
- Author of a request can `close` or `delete` it.
- Admin can delete any request or reply and view platform-wide analytics.

---

## 2. JSON response shapes

### `ServiceRequest`

```json
{
  "id": 42,
  "user_id": 17,
  "author_name": "Rebecca M.",
  "service_type": "Occupational Therapist",
  "category_id": 3,
  "location": "Berwick, Melbourne",
  "needed_from": "After May 2026",
  "summary": "Looking for an Occupational Therapist ...",
  "status": "open",
  "created_at": "2026-04-12T03:14:22.000000Z",
  "updated_at": "2026-04-12T03:14:22.000000Z",
  "replies": [
    {
      "id": 101,
      "service_request_id": 42,
      "provider_user_id": 83,
      "provider_name": "Sunrise Allied Health",
      "message": "We have OTs available in Berwick ...",
      "contact_email": "info@sunrisealliedhealth.com.au",
      "contact_phone": "03 9000 1234",
      "created_at": "2026-04-13T09:00:00.000000Z",
      "updated_at": "2026-04-13T09:00:00.000000Z"
    }
  ]
}
```

### Paginated list response

```json
{
  "data": {
    "data": [ /* ServiceRequest[] */ ],
    "total": 57,
    "last_page": 6,
    "current_page": 1,
    "per_page": 10
  }
}
```

The slice reads `data.data` for the list and the pagination fields
(`total`, `last_page`, `current_page`) from the same level.

---

## 3. Endpoints

Prefix: `/api` (implied). All endpoints require an authenticated user
unless noted.

### 3.1 Public list / detail (authenticated)

#### `GET /service-requests`

Query params (all optional):

| Param                     | Type    | Notes                                                                                                                        |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `page`                    | int     | pagination                                                                                                                   |
| `search`                  | string  | matches `service_type`, `summary`                                                                                            |
| `service_type`            | string  | exact match                                                                                                                  |
| `location`                | string  | partial match                                                                                                                |
| `status`                  | enum    | `open` \| `closed`, default `open`                                                                                           |
| `matches_my_categories`   | 0 \| 1  | **Used by the provider Job Board.** When `1`, restrict to requests whose `category_id` is in the authenticated provider's profile categories. |

Returns paginated list as above. Replies must be eager-loaded and
included on every request in the list.

#### `GET /service-requests/{id}`

Returns the single `ServiceRequest` (including `replies`).

---

### 3.2 Participant actions

#### `POST /service-requests`

Creates a new request. Role: `participant` only.

Request body:

```json
{
  "service_type": "Occupational Therapist",
  "category_id": 3,
  "location": "Berwick, Melbourne",
  "needed_from": "After May 2026",
  "summary": "Looking for an OT who can do Functional Assessments..."
}
```

Validation:

- `service_type`: required, max 120
- `category_id`: nullable, must exist in `categories`
- `location`: nullable, max 160
- `needed_from`: nullable, max 80
- `summary`: required, max 2000

Success response: the created `ServiceRequest` (with empty `replies`)
plus `message`.

```json
{ "message": "Your request has been posted", "data": { /* ServiceRequest */ } }
```

#### `PATCH /service-requests/{id}/close`

Role: author only. Sets `status` to `closed`. No body.

#### `DELETE /service-requests/{id}`

Role: author only. Cascade-deletes replies.

---

### 3.3 Provider replies ("apply" on the Job Board)

#### `POST /service-requests/{id}/replies`

Role: `provider` with `tier === 'paid'` only. 403 otherwise. Blocked if
request is `closed`. Blocked if provider already replied (unique index).

Request body:

```json
{
  "message": "We have OTs available in Berwick from May onwards...",
  "contact_email": "info@provider.com.au",
  "contact_phone": "03 9000 1234"
}
```

Validation:

- `message`: required, max 2000
- `contact_email`: required, email
- `contact_phone`: required, max 40

Success response: the created reply.

```json
{ "message": "Reply posted", "data": { /* Reply */ } }
```

#### `DELETE /service-requests/{id}/replies/{replyId}`

Role: author of the reply only.

---

### 3.4 Admin moderation + analytics

All routes here require role `admin`.

#### `GET /admin/service-requests`

Query params: `page`, `search`, `status`, `user_id`.
Returns the same paginated shape as `GET /service-requests` but
includes every request regardless of status.

#### `DELETE /admin/service-requests/{id}`

Hard-deletes the request and all its replies.

#### `DELETE /admin/service-requests/{id}/replies/{replyId}`

Hard-deletes a single reply.

#### `GET /admin/service-requests/stats`

Returns aggregate analytics consumed by the admin Service Requests page
(stat cards + top-lists panels).

Response:

```json
{
  "data": {
    "total_requests": 128,
    "open_requests": 94,
    "closed_requests": 34,
    "total_replies": 312,
    "requests_this_week": 18,
    "replies_this_week": 54,
    "by_service_type": [
      { "service_type": "Occupational Therapist", "count": 24 },
      { "service_type": "Support Coordinator",    "count": 19 },
      { "service_type": "Physiotherapist",        "count": 13 }
    ],
    "top_providers": [
      { "provider_user_id": 83, "provider_name": "Sunrise Allied Health", "reply_count": 41 },
      { "provider_user_id": 91, "provider_name": "InReach Support",        "reply_count": 33 }
    ],
    "replies_per_week": [
      { "week_start": "2026-02-23", "count": 42 },
      { "week_start": "2026-03-02", "count": 51 }
    ]
  }
}
```

The UI currently consumes `total_requests`, `open_requests`,
`closed_requests`, `total_replies`, `by_service_type`, and
`top_providers`. The other fields are reserved for later charts.

---

## 4. Frontend integration summary

| UI page                                             | Route                                   | Thunks used                                                                                                              |
| --------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Participant — Looking for Services                  | `/participant/looking-for-services`     | `fetchServiceRequests`, `createServiceRequest`, `closeServiceRequest`, `deleteServiceRequest`                             |
| Provider — Job Board                                | `/provider/jobs`                        | `fetchServiceRequests` (with `matches_my_categories=1`), `createServiceRequestReply`, `deleteServiceRequestReply`        |
| Admin — Service Requests                            | `/admin/service-requests`               | `adminFetchServiceRequestStats`, `adminFetchServiceRequests`, `adminDeleteServiceRequest`, `adminDeleteServiceRequestReply` |

Redux slice: `state.serviceRequest` (see `src/store/slices/serviceRequestSlice.js`).

Selectors used in components:

- `state.serviceRequest.list` — current page of requests
- `state.serviceRequest.status` — list loading status
- `state.serviceRequest.saveStatus` — create-request status
- `state.serviceRequest.replyStatus` — reply status
- `state.serviceRequest.stats` — admin analytics payload
- `state.serviceRequest.statsStatus` — analytics loading status
- `state.serviceRequest.total`, `totalPages`, `page` — pagination

---

## 5. Suggested Laravel migration

```php
Schema::create('service_requests', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('service_type', 120);
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('location', 160)->nullable();
    $table->string('needed_from', 80)->nullable();
    $table->text('summary');
    $table->enum('status', ['open', 'closed'])->default('open');
    $table->timestamps();
    $table->index(['status', 'created_at']);
});

Schema::create('service_request_replies', function (Blueprint $table) {
    $table->id();
    $table->foreignId('service_request_id')->constrained()->cascadeOnDelete();
    $table->foreignId('provider_user_id')->constrained('users')->cascadeOnDelete();
    $table->text('message');
    $table->string('contact_email')->nullable();
    $table->string('contact_phone', 40)->nullable();
    $table->timestamps();
    $table->unique(['service_request_id', 'provider_user_id']);
});
```

### Laravel route stubs

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {

    // Public list/detail (any authenticated user)
    Route::get('service-requests', [ServiceRequestController::class, 'index']);
    Route::get('service-requests/{serviceRequest}', [ServiceRequestController::class, 'show']);

    // Participant
    Route::post('service-requests', [ServiceRequestController::class, 'store'])
        ->middleware('role:participant');
    Route::patch('service-requests/{serviceRequest}/close', [ServiceRequestController::class, 'close'])
        ->middleware('can:update,serviceRequest');
    Route::delete('service-requests/{serviceRequest}', [ServiceRequestController::class, 'destroy'])
        ->middleware('can:delete,serviceRequest');

    // Provider (paid) — replies
    Route::post('service-requests/{serviceRequest}/replies', [ServiceRequestReplyController::class, 'store'])
        ->middleware(['role:provider', 'tier:paid']);
    Route::delete('service-requests/{serviceRequest}/replies/{reply}', [ServiceRequestReplyController::class, 'destroy'])
        ->middleware('can:delete,reply');

    // Admin
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('service-requests/stats', [AdminServiceRequestController::class, 'stats']);
        Route::get('service-requests', [AdminServiceRequestController::class, 'index']);
        Route::delete('service-requests/{serviceRequest}', [AdminServiceRequestController::class, 'destroy']);
        Route::delete('service-requests/{serviceRequest}/replies/{reply}', [AdminServiceRequestController::class, 'destroyReply']);
    });
});
```

---

## 6. Notifications (optional, phase 2)

When a provider posts a reply, email the participant ("A provider has
replied to your request — log in to see their contact details"). Do
**not** send the provider's contact via email; keep the app as the only
way to see replies.
