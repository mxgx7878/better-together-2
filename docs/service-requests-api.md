# Service Requests — Backend API Spec

Module: **Looking for Services** (participant side) /
**Service Requests** (provider + admin side).

Frontend is already wired to all of these endpoints through Redux thunks
in `src/store/actions/serviceRequestActions.js`. This doc is the contract
the backend needs to implement so the UI works end-to-end.

All endpoints are authenticated (Bearer token, same as the rest of the
API). The base URL is whatever `API_BASE_URL` resolves to in the client.

Validation errors should follow the existing Laravel format the client
already handles:

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
| `category_id`  | FK → `categories.id`, nullable            | optional link to Services & Categories            |
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
- Admin can delete any request or reply.

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

| Param          | Type   | Notes                                    |
| -------------- | ------ | ---------------------------------------- |
| `page`         | int    | pagination                               |
| `search`       | string | matches `service_type`, `summary`        |
| `service_type` | string | exact match                              |
| `location`     | string | partial match                            |
| `status`       | enum   | `open` \| `closed`, default `open`       |

Returns paginated list as above.

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

### 3.3 Provider replies

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

### 3.4 Admin moderation

All routes here require role `admin`.

#### `GET /admin/service-requests`

Query params: `page`, `search`, `status`, `user_id`.
Returns the same paginated shape as `GET /service-requests` but
includes every request regardless of status.

#### `DELETE /admin/service-requests/{id}`

Hard-deletes the request and all its replies.

#### `DELETE /admin/service-requests/{id}/replies/{replyId}`

Hard-deletes a single reply.

---

## 4. Frontend integration summary

| UI page                                             | Route                                   | Thunks used                                                                                                       |
| --------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Participant — Looking for Services                  | `/participant/looking-for-services`     | `fetchServiceRequests`, `createServiceRequest`, `closeServiceRequest`, `deleteServiceRequest`                      |
| Provider — Service Requests                         | `/provider/service-requests`            | `fetchServiceRequests`, `createServiceRequestReply`, `deleteServiceRequestReply`                                   |
| Admin — Service Requests                            | `/admin/service-requests`               | `adminFetchServiceRequests`, `adminDeleteServiceRequest`, `adminDeleteServiceRequestReply`                         |

Redux slice: `state.serviceRequest` (see `src/store/slices/serviceRequestSlice.js`).

Selectors used in components:

- `state.serviceRequest.list` — current page of requests
- `state.serviceRequest.status` — list loading status
- `state.serviceRequest.saveStatus` — create-request status
- `state.serviceRequest.replyStatus` — reply status
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

---

## 6. Notifications (optional, phase 2)

When a provider posts a reply, email the participant ("A provider has
replied to your request — log in to see their contact details"). Do
**not** send the provider's contact via email; keep the app as the only
way to see replies.
