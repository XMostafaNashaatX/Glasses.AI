from rest_framework import serializers
from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")
        extra_kwargs = {
            "book": {"write_only": True},  # Write-only, don't return in the response
            "user": {"write_only": True},  # Write-only, don't return in the response
        }

    def create(self, validated_data):
        # Ensure that the 'book' and 'user' fields are properly handled if not directly passed
        book = validated_data.get("book")
        user = validated_data.get("user")
        return Rating.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.score = validated_data.get("score", instance.score)
        instance.review = validated_data.get("review", instance.review)
        instance.save()
        return instance
